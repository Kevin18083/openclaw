// 设计模式学习
// 重点：理解模式原理、适用场景、实际应用

console.log('🎨 设计模式学习\n');

// 1. 单例模式 (Singleton)
class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }
        
        this.logs = [];
        Logger.instance = this;
    }
    
    log(message) {
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, message };
        this.logs.push(logEntry);
        console.log(`[${timestamp}] ${message}`);
    }
    
    getLogs() {
        return [...this.logs];
    }
    
    clearLogs() {
        this.logs = [];
    }
}

console.log('=== 单例模式 ===');
const logger1 = new Logger();
const logger2 = new Logger();
console.log('两个logger是同一个实例吗?', logger1 === logger2);
logger1.log('第一条日志');
logger2.log('第二条日志');
console.log('所有日志:', logger1.getLogs());

// 2. 工厂模式 (Factory)
class NotificationFactory {
    static createNotification(type, message) {
        switch (type) {
            case 'email':
                return new EmailNotification(message);
            case 'sms':
                return new SMSNotification(message);
            case 'push':
                return new PushNotification(message);
            default:
                throw new Error(`不支持的通知类型: ${type}`);
        }
    }
}

class EmailNotification {
    constructor(message) {
        this.message = message;
        this.type = 'email';
    }
    
    send() {
        console.log(`📧 发送邮件通知: ${this.message}`);
        return { success: true, type: this.type };
    }
}

class SMSNotification {
    constructor(message) {
        this.message = message;
        this.type = 'sms';
    }
    
    send() {
        console.log(`📱 发送短信通知: ${this.message}`);
        return { success: true, type: this.type };
    }
}

class PushNotification {
    constructor(message) {
        this.message = message;
        this.type = 'push';
    }
    
    send() {
        console.log(`🔔 发送推送通知: ${this.message}`);
        return { success: true, type: this.type };
    }
}

console.log('\n=== 工厂模式 ===');
const emailNotif = NotificationFactory.createNotification('email', '您有新的邮件');
const smsNotif = NotificationFactory.createNotification('sms', '验证码: 123456');
emailNotif.send();
smsNotif.send();

// 3. 观察者模式 (Observer)
class NewsPublisher {
    constructor() {
        this.subscribers = new Map();
        this.news = [];
    }
    
    subscribe(topic, subscriber) {
        if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, new Set());
        }
        this.subscribers.get(topic).add(subscriber);
        console.log(`👤 ${subscriber.name} 订阅了 ${topic}`);
    }
    
    unsubscribe(topic, subscriber) {
        if (this.subscribers.has(topic)) {
            this.subscribers.get(topic).delete(subscriber);
            console.log(`👋 ${subscriber.name} 取消订阅 ${topic}`);
        }
    }
    
    publishNews(topic, news) {
        console.log(`\n📰 发布新闻 [${topic}]: ${news}`);
        this.news.push({ topic, news, timestamp: new Date() });
        
        if (this.subscribers.has(topic)) {
            this.subscribers.get(topic).forEach(subscriber => {
                subscriber.receiveNews(topic, news);
            });
        }
    }
    
    getSubscriberCount(topic) {
        return this.subscribers.has(topic) ? this.subscribers.get(topic).size : 0;
    }
}

class NewsSubscriber {
    constructor(name) {
        this.name = name;
        this.receivedNews = [];
    }
    
    receiveNews(topic, news) {
        this.receivedNews.push({ topic, news, timestamp: new Date() });
        console.log(`   ${this.name} 收到新闻: ${news}`);
    }
    
    getNewsCount() {
        return this.receivedNews.length;
    }
}

console.log('\n=== 观察者模式 ===');
const publisher = new NewsPublisher();
const alice = new NewsSubscriber('Alice');
const bob = new NewsSubscriber('Bob');
const charlie = new NewsSubscriber('Charlie');

publisher.subscribe('科技', alice);
publisher.subscribe('科技', bob);
publisher.subscribe('体育', charlie);
publisher.subscribe('体育', bob);

publisher.publishNews('科技', 'AI新突破：GPT-5发布');
publisher.publishNews('体育', '奥运会中国代表团再获金牌');
publisher.publishNews('科技', '量子计算机实现重大进展');

console.log(`\n📊 统计信息:`);
console.log(`科技频道订阅者: ${publisher.getSubscriberCount('科技')}人`);
console.log(`体育频道订阅者: ${publisher.getSubscriberCount('体育')}人`);
console.log(`Alice收到新闻数: ${alice.getNewsCount()}条`);
console.log(`Bob收到新闻数: ${bob.getNewsCount()}条`);

// 4. 策略模式 (Strategy)
class PaymentProcessor {
    constructor(strategy) {
        this.strategy = strategy;
    }
    
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    
    processPayment(amount) {
        return this.strategy.pay(amount);
    }
}

class CreditCardPayment {
    pay(amount) {
        console.log(`💳 信用卡支付: $${amount.toFixed(2)}`);
        return { method: 'credit_card', amount, status: 'success' };
    }
}

class PayPalPayment {
    pay(amount) {
        console.log(`💰 PayPal支付: $${amount.toFixed(2)}`);
        return { method: 'paypal', amount, status: 'success' };
    }
}

class CryptoPayment {
    pay(amount) {
        console.log(`₿ 加密货币支付: $${amount.toFixed(2)}`);
        return { method: 'crypto', amount, status: 'success' };
    }
}

console.log('\n=== 策略模式 ===');
const processor = new PaymentProcessor(new CreditCardPayment());
processor.processPayment(99.99);

processor.setStrategy(new PayPalPayment());
processor.processPayment(49.99);

processor.setStrategy(new CryptoPayment());
processor.processPayment(199.99);

// 5. 装饰器模式 (Decorator) - 传统实现
class DataService {
    fetchData(id) {
        // 模拟数据获取
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ id, data: `数据内容 ${id}`, timestamp: new Date() });
            }, 500);
        });
    }
    
    processData(data) {
        // 模拟数据处理
        const processed = {
            ...data,
            processed: true,
            processedAt: new Date()
        };
        return processed;
    }
}

// 装饰器函数
function withLogging(service) {
    const originalFetchData = service.fetchData;
    const originalProcessData = service.processData;
    
    service.fetchData = function(...args) {
        console.log(`🔄 开始执行: fetchData`, args);
        const startTime = Date.now();
        
        return originalFetchData.apply(this, args)
            .then(result => {
                const endTime = Date.now();
                console.log(`✅ 执行完成: fetchData (耗时: ${endTime - startTime}ms)`);
                return result;
            })
            .catch(error => {
                console.error(`❌ 执行失败: fetchData`, error);
                throw error;
            });
    };
    
    service.processData = function(...args) {
        console.log(`🔄 开始执行: processData`, args);
        const startTime = Date.now();
        
        try {
            const result = originalProcessData.apply(this, args);
            const endTime = Date.now();
            console.log(`✅ 执行完成: processData (耗时: ${endTime - startTime}ms)`);
            return result;
        } catch (error) {
            console.error(`❌ 执行失败: processData`, error);
            throw error;
        }
    };
    
    return service;
}

console.log('\n=== 装饰器模式 ===');
const dataService = withLogging(new DataService());

// 使用装饰器增强的方法
dataService.fetchData(1)
    .then(data => {
        console.log('获取的数据:', data);
        return dataService.processData(data);
    })
    .then(processed => {
        console.log('处理后的数据:', processed);
    });

// 6. 实际应用：电商订单系统
console.log('\n=== 实际应用：电商订单系统 ===');

class Order {
    constructor(items, customer) {
        this.items = items;
        this.customer = customer;
        this.status = 'pending';
        this.createdAt = new Date();
        this.total = this.calculateTotal();
    }
    
    calculateTotal() {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    
    applyDiscount(discountStrategy) {
        const discount = discountStrategy.calculateDiscount(this.total);
        this.total -= discount;
        console.log(`应用折扣: -$${discount.toFixed(2)}, 最终价格: $${this.total.toFixed(2)}`);
        return this.total;
    }
}

class VIPDiscount {
    calculateDiscount(total) {
        return total * 0.2; // VIP 8折
    }
}

class CouponDiscount {
    constructor(amount) {
        this.amount = amount;
    }
    
    calculateDiscount(total) {
        return Math.min(this.amount, total * 0.5); // 最多减50%
    }
}

const order = new Order([
    { name: '商品A', price: 29.99, quantity: 2 },
    { name: '商品B', price: 49.99, quantity: 1 }
], '客户张三');

console.log('订单总价:', order.total.toFixed(2));
order.applyDiscount(new VIPDiscount());
order.applyDiscount(new CouponDiscount(15));

console.log('\n🎨 设计模式学习完成！');