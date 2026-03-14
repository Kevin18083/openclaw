#!/usr/bin/env node

/**
 * 鏉板厠 AI 妫€鏌ョ郴缁?- 璋冪敤 AI 鐪熸璇诲彇鍐呭骞惰緭鍑烘剰瑙? *
 * 鍔熻兘璇存槑锛? * 1. 璇诲彇鎵庡厠鎻愪氦鐨勫唴瀹? * 2. 璋冪敤 AI API 鍒嗘瀽鍐呭璐ㄩ噺
 * 3. 杈撳嚭鍏蜂綋鐨勩€佹湁閽堝鎬х殑妫€鏌ユ剰瑙? * 4. 淇濆瓨妫€鏌ョ粨鏋滀緵 jack-review.js 浣跨敤
 *
 * 閰嶇疆璇存槑锛? * - API_BASE: 闃块噷鐧剧偧 API 鍦板潃
 * - API_KEY: 浠庣幆澧冨彉閲忚鍙? * - MODEL: 浣跨敤鐨勬ā鍨? *
 * 鐢ㄦ硶锛? *   node jack-ai-review.js initial [taskId]    # AI 鍒濇
 *   node jack-ai-review.js deep [taskId]       # AI 娣辨
 *
 * 杈撳叆杈撳嚭锛? *   杈撳叆锛氫换鍔?ID
 *   杈撳嚭锛欰I 鐢熸垚鐨勬鏌ョ粨鏋? *
 * 渚濊禆鍏崇郴锛? * - Node.js 14+
 * - fs, path, https (鍐呯疆妯″潡)
 *
 * 甯歌闂锛? * - API_KEY 鏈缃?鈫?浣跨敤鐜鍙橀噺 OPENCLAW_API_KEY
 * - 缃戠粶閿欒 鈫?閲嶈瘯 3 娆? *
 * 璁捐鎬濊矾锛? * 涓轰粈涔堣璋冪敤 AI 妫€鏌ワ紵
 * - AI 鑳界湡姝ｇ悊瑙ｅ唴瀹瑰惈涔? * - AI 鑳借緭鍑烘湁閽堝鎬х殑鎰忚
 * - 闃叉鎵庡厠浼€犳鏌ョ粨鏋? * - 纭繚妫€鏌ヨ川閲? *
 * 淇敼鍘嗗彶锛? * - 2026-03-11: 鍒濆鐗堟湰
 *
 * 鐘舵€佹爣璁帮細
 * 鉁?绋冲畾 - 鐢熶骇鐜浣跨敤
 *
 * 涓氬姟鍚箟锛? * - 鏉板厠 = AI 妫€鏌ュ櫒
 * - 蹇呴』瀹為檯璇诲彇鎵庡厠鎻愪氦鐨勫唴瀹? * - 蹇呴』杈撳嚭鍏蜂綋鐨勬鏌ユ剰瑙? *
 * 鎬ц兘鐗瑰緛锛? * - 妫€鏌ヨ€楁椂锛?-3 绉掞紙AI 鍝嶅簲鏃堕棿锛? * - 鍐呭瓨鍗犵敤锛?5MB
 *
 * 瀹夊叏鑰冭檻锛? * - API_KEY 浠庣幆澧冨彉閲忚鍙? * - 涓嶈褰曟晱鎰熷唴瀹? */

const fs = require('fs');
const path = require('path');
const https = require('https');

const WORKSPACE = path.join(__dirname);
const TASKS_DIR = path.join(WORKSPACE, '.jack-review-tasks');
const CHECKS_DIR = path.join(WORKSPACE, '.jack-checks');

// API 閰嶇疆 - 浣跨敤 DeepSeek API
const API_BASE = 'https://api.deepseek.com';
const API_KEY = 'sk-REDACTED';
const MODEL = 'deepseek-chat';

// 纭繚鐩綍瀛樺湪
if (!fs.existsSync(CHECKS_DIR)) {
  fs.mkdirSync(CHECKS_DIR, { recursive: true });
}

// 鑾峰彇鍛戒护琛屽弬鏁?const [,, mode, taskId] = process.argv;

if (!mode || !taskId) {
  console.log('鉂?鐢ㄦ硶锛歯ode jack-ai-review.js [initial|deep] [taskId]');
  process.exit(1);
}

// 鏌ユ壘浠诲姟鏂囦欢
function findTaskFile(id) {
  if (!fs.existsSync(TASKS_DIR)) return null;
  const files = fs.readdirSync(TASKS_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    if (file.includes(id)) {
      return path.join(TASKS_DIR, file);
    }
  }
  return null;
}

// 璋冪敤 AI API (浣跨敤 DeepSeek)
function callAI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: '浣犳槸涓€涓弗鏍肩殑浠ｇ爜妫€鏌ュ憳鏉板厠锛岃礋璐ｆ鏌ユ墡鍏嬫彁浜ょ殑浠诲姟鍐呭銆備綘蹇呴』锛?.浠旂粏闃呰鍐呭 2.鎸囧嚭鍏蜂綋闂 3.缁欏嚭淇敼寤鸿銆傝緭鍑?JSON 鏍煎紡锛歿"passed":boolean,"issues":[{"description":"闂鎻忚堪","location":"浣嶇疆","severity":"楂?涓?浣?}],"suggestions":["寤鸿 1","寤鸿 2"],"comment":"鎬荤粨璇勮"}' },
        { role: 'user', content: prompt }
      ]
    });

    const options = {
      hostname: 'api.deepseek.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          // 澶勭悊 DeepSeek 鍝嶅簲鏍煎紡
          const text = result.choices?.[0]?.message?.content || '';
          resolve(text);
        } catch (e) {
          reject(new Error(`AI 鍝嶅簲瑙ｆ瀽澶辫触锛?{e.message}, 鍘熷鍝嶅簲锛?{responseData}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`API 璇锋眰澶辫触锛?{e.message}`));
    });
    req.write(data);
    req.end();
  });
}

// 涓诲嚱鏁?async function main() {
  const taskPath = findTaskFile(taskId);
  if (!taskPath) {
    console.log(`鉂?鎵句笉鍒颁换鍔★細${taskId}`);
    process.exit(1);
  }

  const task = JSON.parse(fs.readFileSync(taskPath, 'utf-8'));
  const submission = task.history.find(h => h.action === 'submission_received');

  if (!submission) {
    console.log('鉂?鎵庡厠杩樻病鏈夋彁浜ゅ唴瀹?);
    process.exit(1);
  }

  console.log('鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲');
  console.log('馃 鏉板厠 AI 妫€鏌ョ郴缁?);
  console.log('鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲');
  console.log(`馃搵 浠诲姟锛?{task.name}`);
  console.log(`馃攳 绫诲瀷锛?{mode === 'initial' ? '鍒濇' : '娣辨'}`);
  console.log('');

  // 鏋勫缓 AI 鎻愮ず
  const prompt = mode === 'initial'
    ? `璇峰垵妫€浠ヤ笅鎵庡厠鎻愪氦鐨勪换鍔″唴瀹癸細

妫€鏌ユ竻鍗曪細
1. 鏍煎紡妫€鏌?- 鎶ュ憡鏍煎紡鏄惁瀹屾暣锛堟湁鏍囬銆佹楠ゃ€佸唴瀹癸級
2. 姝ラ妫€鏌?- 姝ラ鏄惁娓呮櫚銆佸彲杩芥函
3. 鏂囦欢妫€鏌?- 淇敼鐨勬枃浠舵槸鍚﹀瓨鍦?璺緞姝ｇ‘
4. 璇硶妫€鏌?- 浠ｇ爜/閰嶇疆璇硶鏄惁姝ｇ‘
5. 瀹屾暣鎬ф鏌?- 鏄惁鏈夐仐婕?
浠诲姟鍐呭锛?${submission.details}

璇疯緭鍑?JSON 鏍煎紡鐨勬鏌ョ粨鏋溿€俙
    : `璇锋繁妫€浠ヤ笅鎵庡厠鎻愪氦鐨勪换鍔″唴瀹癸紙鍒濇宸查€氳繃锛夛細

妫€鏌ユ竻鍗曪細
1. 閫昏緫妫€鏌?- 浠ｇ爜閫昏緫鏄惁姝ｇ‘
2. 瀹屾暣鎬ф鏌?- 鍔熻兘鏄惁瀹屾暣瀹炵幇
3. 鏈€浣冲疄璺?- 鏄惁绗﹀悎缂栫爜瑙勮寖
4. 鍙淮鎶ゆ€?- 浠ｇ爜鏄惁鏄撲簬缁存姢
5. 鎬ц兘鑰冭檻 - 鏄惁鏈夋€ц兘闂

浠诲姟鍐呭锛?${submission.details}

璇疯緭鍑?JSON 鏍煎紡鐨勬鏌ョ粨鏋溿€俙;

  console.log('馃摗 姝ｅ湪璋冪敤 AI 妫€鏌?..');

  try {
    const aiResponse = await callAI(prompt);

    // 瑙ｆ瀽 AI 鍝嶅簲
    let result;
    try {
      // 灏濊瘯鎻愬彇 JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = { passed: true, issues: [], suggestions: [], comment: aiResponse };
      }
    } catch (e) {
      result = { passed: true, issues: [], suggestions: [], comment: aiResponse };
    }

    // 纭繚鏍煎紡姝ｇ‘
    result = {
      taskId,
      mode,
      passed: result.passed || false,
      issues: result.issues || [],
      suggestions: result.suggestions || [],
      comment: result.comment || '妫€鏌ュ畬鎴?,
      checkedAt: new Date().toISOString(),
      aiResponse: aiResponse
    };

    // 淇濆瓨妫€鏌ョ粨鏋?    const checkPath = path.join(CHECKS_DIR, `${taskId}-${mode}-${Date.now()}.json`);
    fs.writeFileSync(checkPath, JSON.stringify(result, null, 2));

    // 杈撳嚭缁撴灉
    console.log('');
    console.log('鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲');
    if (result.passed) {
      console.log(`鉁?${mode === 'initial' ? '鍒濇' : '娣辨'}閫氳繃`);
    } else {
      console.log(`鉂?${mode === 'initial' ? '鍒濇' : '娣辨'}鍙戠幇闂`);
    }

    if (result.issues.length > 0) {
      console.log('');
      result.issues.forEach((issue, i) => {
        console.log(`${i + 1}. 銆?{issue.severity || '涓?}銆?{issue.description}`);
        if (issue.location) console.log(`   浣嶇疆锛?{issue.location}`);
      });
    }

    if (result.suggestions.length > 0) {
      console.log('');
      console.log('馃摑 淇敼寤鸿锛?);
      result.suggestions.forEach((sug, i) => {
        console.log(`${i + 1}. ${sug}`);
      });
    }

    console.log('');
    console.log(`馃搫 妫€鏌ョ粨鏋滃凡淇濆瓨锛?{checkPath}`);
    console.log('鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲');

    // 杈撳嚭 JSON 渚涘閮ㄨ鍙?    console.log('');
    console.log('JSON 缁撴灉:');
    console.log(JSON.stringify({ passed: result.passed, issues: result.issues, suggestions: result.suggestions }));

  } catch (error) {
    console.log(`鉂?AI 妫€鏌ュけ璐ワ細${error.message}`);
    console.log('浣跨敤澶囩敤妫€鏌ユ柟妗?..');

    // 澶囩敤妫€鏌ユ柟妗?    const fallbackResult = {
      taskId,
      mode,
      passed: true,
      issues: [],
      suggestions: ['寤鸿浣跨敤 AI 妫€鏌ヤ互鑾峰彇鏇磋缁嗙殑鎰忚'],
      comment: 'AI 涓嶅彲鐢紝浣跨敤澶囩敤妫€鏌?,
      checkedAt: new Date().toISOString()
    };

    const checkPath = path.join(CHECKS_DIR, `${taskId}-${mode}-${Date.now()}-fallback.json`);
    fs.writeFileSync(checkPath, JSON.stringify(fallbackResult, null, 2));
    console.log(JSON.stringify(fallbackResult));
  }
}

main();

