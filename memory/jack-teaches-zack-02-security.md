# 鏁欑▼ 02锛氬畨鍏ㄧ紪绋嬪疄璺?
> **鏉板厠鏁欐墡鍏嬬郴鍒楁暀绋?- 绗?02 璇?*
>
> 鍒涘缓鏃堕棿锛?026-03-09
> 闅惧害锛氣瓙猸愨瓙猸?> 閲嶈鎬э細猸愨瓙猸愨瓙猸愶紙瀹夊叏闂鏃犲皬浜嬶紒锛?
---

## 馃摎 鏈珷鐩綍

1. [涓轰粈涔堝畨鍏ㄥ緢閲嶈](#1-涓轰粈涔堝畨鍏ㄥ緢閲嶈)
2. [鏁忔劅淇℃伅澶勭悊](#2-鏁忔劅淇℃伅澶勭悊)
3. [杈撳叆楠岃瘉](#3-杈撳叆楠岃瘉)
4. [鏂囦欢鎿嶄綔瀹夊叏](#4-鏂囦欢鎿嶄綔瀹夊叏)
5. [鍛戒护娉ㄥ叆闃叉姢](#5-鍛戒护娉ㄥ叆闃叉姢)
6. [瀹夊叏鏃ュ織璁板綍](#6-瀹夊叏鏃ュ織璁板綍)
7. [瀹夊叏妫€鏌ユ竻鍗昡(#7-瀹夊叏妫€鏌ユ竻鍗?

---

## 1. 涓轰粈涔堝畨鍏ㄥ緢閲嶈

### 1.1 鐪熷疄妗堜緥

```javascript
// 鉂?鐪熷疄鍙戠敓杩囩殑瀹夊叏浜嬫晠
// 鏌愬叕鍙镐唬鐮佷腑纭紪鐮佷簡 AWS 瀵嗛挜
const AWS_KEY = 'AKIA_REDACTED';  // 琚紶鍒?GitHub
// 缁撴灉锛氶粦瀹㈠叆渚碉紝鎹熷け鏁扮櫨涓囩編鍏?
// 鉂?鏌愰」鐩洿鎺ユ嫾鎺ョ敤鎴疯緭鍏ユ墽琛屽懡浠?const userInput = req.query.filename;
exec('cat ' + userInput);  // 鐢ㄦ埛杈撳叆: "file.txt; rm -rf /"
// 缁撴灉锛氭湇鍔″櫒鏂囦欢琚垹闄?```

### 1.2 鏉板厠鐨勫繝鍛?
> 鎵庡厠鍏勫紵锛岃浣忥細
>
> **瀹夊叏闂锛岄闃插鏄擄紝琛ユ晳闅俱€?*
>
> 涓€鏃﹀嚭浜嬶紝杞诲垯鏁版嵁娉勯湶锛岄噸鍒欏叕鍙稿€掗棴銆?>
> 瀹佸彲澶氳姳 5 鍒嗛挓妫€鏌ワ紝涓嶈浜嬪悗 5 澶╂晳鐏€?
---

## 2. 鏁忔劅淇℃伅澶勭悊

### 2.1 瀵嗙爜銆佸瘑閽ャ€乀oken 缁濅笉纭紪鐮?
```javascript
// 鉂?缁濆涓嶈杩欐牱鍐欙紒
const config = {
  password: 'MySecret123!',
  apiKey: 'sk-REDACTED',
  dbPassword: 'prod_db_p@ss'
};

// 鉁?姝ｇ‘鍋氭硶 - 浠庣幆澧冨彉閲忚鍙?const config = {
  password: process.env.DB_PASSWORD,
  apiKey: process.env.API_KEY,
  dbPassword: process.env.PROD_DB_PASSWORD
};

// 鍚姩鍓嶈缃幆澧冨彉閲?// Linux/Mac: export DB_PASSWORD="xxx"
// Windows: set DB_PASSWORD=xxx
```

### 2.2 .env 鏂囦欢绠＄悊

```bash
# .env 鏂囦欢锛堟湰鍦板紑鍙戠敤锛?DB_PASSWORD=dev_password123
API_KEY=sk-test-key

# .env.example 鏂囦欢锛堝彲浠ユ彁浜ゅ埌 Git锛?DB_PASSWORD=your_db_password
API_KEY=your_api_key
```

```javascript
// 浣跨敤 dotenv 搴撳姞杞?require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD;
```

```gitignore
# .gitignore - 涓€瀹氳蹇界暐 .env
.env
.env.local
.env.production
```

---

### 2.3 鍔犲瘑瀛樺偍鏁忔劅鏁版嵁

```javascript
const crypto = require('crypto');

// 鍔犲瘑鍑芥暟
function encrypt(text, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// 瑙ｅ瘑鍑芥暟
function decrypt(encryptedText, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 浣跨敤绀轰緥
const key = process.env.ENCRYPTION_KEY;
const encryptedPassword = encrypt(userPassword, key);
// 瀛樺偍 encryptedPassword 鍒版暟鎹簱
```

---

## 3. 杈撳叆楠岃瘉

### 3.1 鎵€鏈夎緭鍏ラ兘鏄笉鍙俊鐨?
```javascript
// 鉂?鍗遍櫓锛佺洿鎺ヤ娇鐢ㄧ敤鎴疯緭鍏?const filename = req.query.file;
fs.readFile(`/data/${filename}`, callback);  // 鐢ㄦ埛鍙緭鍏?../../../etc/passwd

// 鉁?姝ｇ‘鍋氭硶 - 楠岃瘉 + 娓呯悊
function sanitizeFilename(filename) {
  // 鍙厑璁稿瓧姣嶃€佹暟瀛椼€佷笅鍒掔嚎銆佺偣
  const sanitized = filename.replace(/[^a-zA-Z0-9_.-]/g, '');

  // 闃叉璺緞閬嶅巻
  if (sanitized.includes('..') || sanitized.includes('/')) {
    throw new Error('闈炴硶鏂囦欢鍚?);
  }

  return sanitized;
}

// 浣跨敤
const safeFilename = sanitizeFilename(req.query.file);
fs.readFile(`/data/${safeFilename}`, callback);
```

---

### 3.2 鍙傛暟鍖栨煡璇紙闃?SQL 娉ㄥ叆锛?
```javascript
// 鉂?鍗遍櫓锛丼QL 娉ㄥ叆婕忔礊
const sql = `SELECT * FROM users WHERE username = '${username}'`;
db.query(sql);  // 鐢ㄦ埛杈撳叆锛歛dmin' --

// 鉁?姝ｇ‘鍋氭硶 - 鍙傛暟鍖栨煡璇?const sql = 'SELECT * FROM users WHERE username = ?';
db.query(sql, [username]);  // 鑷姩杞箟
```

---

### 3.3 杈撳叆楠岃瘉搴撶殑浣跨敤

```javascript
// 浣跨敤 joi 搴撹繘琛岄獙璇?const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(150),
  password: Joi.string().min(8).pattern(/^[A-Za-z0-9!@#$%]+$/).required()
});

// 楠岃瘉鐢ㄦ埛杈撳叆
const { error, value } = userSchema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.message });
}
// value 鏄竻鐞嗗悗鐨勫畨鍏ㄦ暟鎹?```

---

## 4. 鏂囦欢鎿嶄綔瀹夊叏

### 4.1 璺緞閬嶅巻闃叉姢

```javascript
const path = require('path');

// 鉂?鍗遍櫓锛佺敤鎴峰彲璁块棶浠绘剰鏂囦欢
app.get('/file', (req, res) => {
  const file = req.query.path;
  res.sendFile(`/var/www/${file}`);  // ../../etc/passwd
});

// 鉁?姝ｇ‘鍋氭硶
app.get('/file', (req, res) => {
  const file = req.query.path;

  // 瑙ｆ瀽骞惰鑼冨寲璺緞
  const basePath = '/var/www';
  const fullPath = path.resolve(basePath, file);

  // 纭繚鍦ㄥ厑璁哥洰褰曞唴
  if (!fullPath.startsWith(basePath)) {
    return res.status(403).json({ error: '绂佹璁块棶' });
  }

  res.sendFile(fullPath);
});
```

---

### 4.2 鏂囦欢鏉冮檺鎺у埗

```javascript
const fs = require('fs');

// 鍒涘缓鏂囦欢鏃惰缃潈闄?fs.writeFileSync('sensitive.txt', 'secret data', {
  mode: 0o600  // 鍙湁鎵€鏈夎€呭彲璇诲啓
});

// 妫€鏌ユ枃浠舵潈闄?const stats = fs.statSync('sensitive.txt');
console.log(stats.mode.toString(8));  // 100600
```

---

## 5. 鍛戒护娉ㄥ叆闃叉姢

### 5.1 姘歌繙涓嶈鎷兼帴鐢ㄦ埛杈撳叆鎵ц鍛戒护

```javascript
// 鉂?鏋佸害鍗遍櫓锛?const filename = req.query.file;
exec(`cat ${filename}`, callback);  // 杈撳叆: file.txt; rm -rf /

// 鉁?姝ｇ‘鍋氭硶 - 浣跨敤鏁扮粍鍙傛暟
const { execFile } = require('child_process');
execFile('cat', [filename], callback);  // 鍙傛暟涓嶄細琚В閲婁负鍛戒护

// 鉁?鏇村ソ鐨勫仛娉?- 閬垮厤 shell 鍛戒护
const fs = require('fs');
fs.readFile(filename, callback);  // 鐢?Node API 浠ｆ浛 shell 鍛戒护
```

---

### 5.2 鐧藉悕鍗曢獙璇?
```javascript
// 濡傛灉蹇呴』鎵ц鍛戒护锛岀敤鐧藉悕鍗?const ALLOWED_COMMANDS = ['ls', 'cat', 'grep'];

function safeExec(command, args, callback) {
  if (!ALLOWED_COMMANDS.includes(command)) {
    throw new Error(`鍛戒护 ${command} 涓嶅湪鐧藉悕鍗曚腑`);
  }

  // 楠岃瘉鍙傛暟涓嶅寘鍚嵄闄╁瓧绗?  const dangerousChars = [';', '|', '&', '$', '`'];
  for (const arg of args) {
    for (const char of dangerousChars) {
      if (arg.includes(char)) {
        throw new Error('鍙傛暟鍖呭惈鍗遍櫓瀛楃');
      }
    }
  }

  const { execFile } = require('child_process');
  execFile(command, args, callback);
}
```

---

## 6. 瀹夊叏鏃ュ織璁板綍

### 6.1 鏃ュ織涓笉瑕佽褰曟晱鎰熶俊鎭?
```javascript
// 鉂?鍗遍櫓锛佹棩蹇楁硠闇叉晱鎰熶俊鎭?console.log('鐢ㄦ埛鐧诲綍:', { username, password, token });

// 鉁?姝ｇ‘鍋氭硶 - 鑴辨晱澶勭悊
function maskSensitive(data) {
  const masked = { ...data };
  if (masked.password) masked.password = '***';
  if (masked.token) masked.token = masked.token.substring(0, 8) + '***';
  return masked;
}

console.log('鐢ㄦ埛鐧诲綍:', maskSensitive({ username, password, token }));
```

---

### 6.2 瀹夊叏浜嬩欢鏃ュ織

```javascript
// 璁板綍瀹夊叏鐩稿叧浜嬩欢
function logSecurityEvent(event, details) {
  const entry = {
    timestamp: new Date().toISOString(),
    event,  // 'LOGIN_FAILED', 'ACCESS_DENIED', 'SUSPICIOUS_INPUT'
    ip: details.ip,
    user: details.user,
    details: sanitizeForLog(details)  // 鑴辨晱
  };

  // 瀹夊叏鏃ュ織鍗曠嫭鏂囦欢
  fs.appendFileSync('security.log', JSON.stringify(entry) + '\n');
}

// 浣跨敤
logSecurityEvent('LOGIN_FAILED', {
  ip: req.ip,
  user: username,
  reason: 'invalid_password'
});
```

---

## 7. 瀹夊叏妫€鏌ユ竻鍗?
### 7.1 浠ｇ爜瀹℃煡妫€鏌ラ」

姣忔鍐欏畬浠ｇ爜锛屾墡鍏嬪簲璇ユ鏌ワ細

**鏁忔劅淇℃伅**锛?- [ ] 娌℃湁纭紪鐮佸瘑鐮併€佸瘑閽ャ€乀oken
- [ ] .env 鏂囦欢宸插姞鍏?.gitignore
- [ ] 鏁忔劅鏁版嵁宸插姞瀵嗗瓨鍌?
**杈撳叆楠岃瘉**锛?- [ ] 鎵€鏈夌敤鎴疯緭鍏ラ兘缁忚繃楠岃瘉
- [ ] 浣跨敤浜嗗弬鏁板寲鏌ヨ锛堝鏋滄搷浣滄暟鎹簱锛?- [ ] 鏂囦欢鍚嶃€佽矾寰勭粡杩囨竻鐞?
**鏂囦欢鎿嶄綔**锛?- [ ] 鏂囦欢璺緞鍋氫簡瑙勮寖鍖栧鐞?- [ ] 闄愬埗浜嗚闂洰褰曡寖鍥?- [ ] 璁剧疆浜嗗悎閫傜殑鏂囦欢鏉冮檺

**鍛戒护鎵ц**锛?- [ ] 娌℃湁鎷兼帴鐢ㄦ埛杈撳叆鎵ц鍛戒护
- [ ] 浣跨敤浜嗙櫧鍚嶅崟楠岃瘉
- [ ] 灏介噺鐢?API 浠ｆ浛 shell 鍛戒护

**鏃ュ織璁板綍**锛?- [ ] 鏃ュ織涓病鏈夋槑鏂囧瘑鐮?- [ ] Token 绛夋晱鎰熶俊鎭凡鑴辨晱
- [ ] 瀹夊叏浜嬩欢鏈夊崟鐙褰?
---

### 7.2 瀹夊叏绛夌骇鑷瘎

| 绛夌骇 | 鎻忚堪 | 琛屽姩 |
|------|------|------|
| 馃敶 Critical | 鍙戠幇涓ラ噸婕忔礊锛堝纭紪鐮佸瘑鐮侊級 | 绔嬪嵆淇锛屽仠姝笂绾?|
| 馃煚 High | 鍙戠幇楂樺嵄闂锛堝缂哄皯杈撳叆楠岃瘉锛?| 浼樺厛淇锛屾殏缂撲笂绾?|
| 馃煛 Medium | 鍙戠幇涓嵄闂锛堝鏃ュ織杩囦簬璇︾粏锛?| 璁″垝淇锛屽彲涓婄嚎 |
| 馃煝 Low | 杞诲井闂锛堝娉ㄩ噴閫忛湶鍐呴儴淇℃伅锛?| 鏈夌┖鍐嶆敼 |

---

## 璇惧悗缁冧範

### 缁冧範 1锛氭壘鍑轰唬鐮佷腑鐨勫畨鍏ㄩ棶棰?
```javascript
// 涓嬮潰杩欐浠ｇ爜鏈夊摢浜涘畨鍏ㄩ棶棰橈紵
const express = require('express');
const app = express();

const DB_PASSWORD = 'prod123456';  // 闂 1

app.get('/user', (req, res) => {
  const userId = req.query.id;
  const sql = `SELECT * FROM users WHERE id = ${userId}`;  // 闂 2
  db.query(sql);
});

app.get('/file', (req, res) => {
  const file = req.query.name;
  res.sendFile(`/var/www/${file}`);  // 闂 3
});

console.log('API Key:', process.env.API_KEY);  // 闂 4
```

---

## 鏉板厠瀵勮

> 鎵庡厠鍏勫紵锛?>
> 瀹夊叏杩欎欢浜嬶紝璇撮毦闅撅紝璇寸畝鍗曚篃绠€鍗曘€?>
> **闅剧殑鏄?*锛氳鏃跺埢淇濇寔璀︽儠锛屼笉鑳芥湁渚ュ垢蹇冪悊銆?>
> **绠€鍗曠殑鏄?*锛氬吇鎴愯壇濂界殑缂栫爜涔犳儻锛屽畨鍏ㄩ棶棰樿嚜鐒惰繙绂讳綘銆?>
> 鍝ュ摜鎴戝啓浠ｇ爜杩欎箞澶氬勾锛岄潬鐨勫氨鏄竴涓?绋?瀛椼€?>
> 浣犱篃涓€鏍凤紝绋崇ǔ褰撳綋鍦板啓浠ｇ爜锛屽畨瀹夊叏鍏ㄥ湴鍋氶」鐩紒

---

*鏁欑▼鍒涘缓鏃堕棿锛?026-03-09*
*浣滆€咃細鏉板厠 (Jack)*
*瀛︾敓锛氭墡鍏?(Zack)*

