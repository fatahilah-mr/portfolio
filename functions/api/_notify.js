// functions/api/_notify.js
// Cloudflare Pages Functions - Unified Notification Dispatcher (Telegram & ntfy)
// Priority: 1. D1 Database port_site_config -> 2. Environment Variables fallback

export async function getNotificationConfig(env) {
  let dbConfig = null;
  if (env.DB) {
    try {
      const { results } = await env.DB.prepare(
        'SELECT tele_bot_token, tele_chat_id, tele_enabled, ntfy_server, ntfy_topic, ntfy_token FROM port_site_config WHERE id = "default"'
      ).all();
      if (results && results.length > 0) {
        dbConfig = results[0];
      }
    } catch (e) {
      console.warn('Failed to fetch notification config from D1:', e);
    }
  }

  const teleBotToken = (dbConfig && dbConfig.tele_bot_token) || env.TELEGRAM_BOT_TOKEN || '';
  const teleChatId = (dbConfig && dbConfig.tele_chat_id) || env.TELEGRAM_CHAT_ID || '';
  const teleEnabled = dbConfig ? Boolean(dbConfig.tele_enabled) : true;

  const ntfyServer = (dbConfig && dbConfig.ntfy_server) || env.NTFY_SERVER || 'https://ntfy.fmr.web.id';
  const ntfyTopic = (dbConfig && dbConfig.ntfy_topic) || env.NTFY_TOPIC || 'agent';
  const ntfyToken = (dbConfig && dbConfig.ntfy_token) || env.NTFY_TOKEN || '';

  return {
    teleBotToken,
    teleChatId,
    teleEnabled,
    ntfyServer: ntfyServer.replace(/\/+$/, ''),
    ntfyTopic,
    ntfyToken
  };
}

export async function sendNotification(env, { title, message, priority = 'default', tags = ['bell'] }) {
  const config = await getNotificationConfig(env);
  const results = {
    telegram: { success: false, info: 'Skipped' },
    ntfy: { success: false, info: 'Skipped' }
  };

  // 1. Dispatch Telegram
  if (config.teleEnabled && config.teleBotToken && config.teleChatId) {
    try {
      const teleUrl = `https://api.telegram.org/bot${config.teleBotToken}/sendMessage`;
      const text = `🔔 <b>${title}</b>\n\n${message}`;
      const teleRes = await fetch(teleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.teleChatId,
          text,
          parse_mode: 'HTML'
        })
      });
      const teleData = await teleRes.json();
      results.telegram = {
        success: teleData.ok === true,
        info: teleData.ok ? 'Sent successfully' : (teleData.description || 'Telegram API error')
      };
    } catch (err) {
      results.telegram = { success: false, info: err.message };
    }
  } else {
    results.telegram = {
      success: false,
      info: !config.teleEnabled ? 'Telegram disabled in config' : 'Missing Bot Token or Chat ID'
    };
  }

  // 2. Dispatch ntfy
  if (config.ntfyServer && config.ntfyTopic) {
    try {
      const ntfyUrl = `${config.ntfyServer}/${config.ntfyTopic}`;
      const headers = {
        'Title': title,
        'Priority': priority,
        'Tags': tags.join(',')
      };
      if (config.ntfyToken) {
        headers['Authorization'] = `Bearer ${config.ntfyToken}`;
      }

      const ntfyRes = await fetch(ntfyUrl, {
        method: 'POST',
        headers,
        body: message
      });
      results.ntfy = {
        success: ntfyRes.ok,
        info: ntfyRes.ok ? 'Sent successfully' : `HTTP ${ntfyRes.status}`
      };
    } catch (err) {
      results.ntfy = { success: false, info: err.message };
    }
  } else {
    results.ntfy = { success: false, info: 'Missing ntfy server or topic' };
  }

  return results;
}
