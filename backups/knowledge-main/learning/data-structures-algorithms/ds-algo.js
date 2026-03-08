// 数据结构和算法学习
// 重点：理解原理、时间复杂度、实际应用

console.log('📊 数据结构和算法学习\n');

// 1. 链表实现
class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    
    append(value) {
        const newNode = new ListNode(value);
        
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        
        this.length++;
        return this;
    }
    
    prepend(value) {
        const newNode = new ListNode(value);
        
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }
        
        this.length++;
        return this;
    }
    
    find(value) {
        let current = this.head;
        let index = 0;
        
        while (current) {
            if (current.value === value) {
                return { node: current, index };
            }
            current = current.next;
            index++;
        }
        
        return null;
    }
    
    toArray() {
        const result = [];
        let current = this.head;
        
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        
        return result;
    }
}

console.log('=== 链表实现 ===');
const list = new LinkedList();
list.append(1).append(2).append(3).prepend(0);
console.log('链表内容:', list.toArray());
console.log('查找值2:', list.find(2));
console.log('链表长度:', list.length);

// 2. 栈实现（后进先出）
class Stack {
    constructor() {
        this.items = [];
    }
    
    push(item) {
        this.items.push(item);
    }
    
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop();
    }
    
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    clear() {
        this.items = [];
    }
}

console.log('\n=== 栈实现 ===');
const stack = new Stack();
stack.push('任务1');
stack.push('任务2');
stack.push('任务3');
console.log('栈顶元素:', stack.peek());
console.log('弹出元素:', stack.pop());
console.log('栈大小:', stack.size());

// 3. 队列实现（先进先出）
class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(item) {
        this.items.push(item);
    }
    
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }
    
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    clear() {
        this.items = [];
    }
}

console.log('\n=== 队列实现 ===');
const queue = new Queue();
queue.enqueue('用户A');
queue.enqueue('用户B');
queue.enqueue('用户C');
console.log('队首元素:', queue.front());
console.log('出队元素:', queue.dequeue());
console.log('队列大小:', queue.size());

// 4. 常见算法实现
class Algorithms {
    // 快速排序
    static quickSort(arr) {
        if (arr.length <= 1) {
            return arr;
        }
        
        const pivot = arr[Math.floor(arr.length / 2)];
        const left = [];
        const right = [];
        const equal = [];
        
        for (const item of arr) {
            if (item < pivot) {
                left.push(item);
            } else if (item > pivot) {
                right.push(item);
            } else {
                equal.push(item);
            }
        }
        
        return [...Algorithms.quickSort(left), ...equal, ...Algorithms.quickSort(right)];
    }
    
    // 二分查找
    static binarySearch(arr, target) {
        let left = 0;
        let right = arr.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            if (arr[mid] === target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
    
    // 斐波那契数列（动态规划优化）
    static fibonacci(n) {
        if (n <= 1) return n;
        
        let prev = 0;
        let current = 1;
        
        for (let i = 2; i <= n; i++) {
            const next = prev + current;
            prev = current;
            current = next;
        }
        
        return current;
    }
}

console.log('\n=== 算法实现 ===');
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
console.log('原始数组:', unsortedArray);
console.log('快速排序后:', Algorithms.quickSort([...unsortedArray]));

const sortedArray = Algorithms.quickSort([...unsortedArray]);
console.log('二分查找 22:', Algorithms.binarySearch(sortedArray, 22));
console.log('二分查找 99:', Algorithms.binarySearch(sortedArray, 99));

console.log('斐波那契数列(10):', Algorithms.fibonacci(10));

// 5. 实际应用：任务调度器
class TaskScheduler {
    constructor() {
        this.tasks = new Map();
        this.taskQueue = new Queue();
        this.completedTasks = new Stack();
    }
    
    addTask(id, task) {
        this.tasks.set(id, {
            id,
            task,
            status: 'pending',
            createdAt: new Date()
        });
        this.taskQueue.enqueue(id);
        console.log(`✅ 添加任务: ${id}`);
    }
    
    processNext() {
        const taskId = this.taskQueue.dequeue();
        
        if (!taskId) {
            console.log('📭 任务队列为空');
            return null;
        }
        
        const task = this.tasks.get(taskId);
        if (!task) {
            console.log(`❌ 任务 ${taskId} 不存在`);
            return null;
        }
        
        console.log(`⚡ 开始处理任务: ${taskId}`);
        task.status = 'processing';
        task.startedAt = new Date();
        
        // 模拟任务处理
        setTimeout(() => {
            task.status = 'completed';
            task.completedAt = new Date();
            task.duration = task.completedAt - task.startedAt;
            this.completedTasks.push(taskId);
            console.log(`🎉 完成任务: ${taskId} (耗时: ${task.duration}ms)`);
        }, Math.random() * 1000 + 500);
        
        return taskId;
    }
    
    getStats() {
        const pending = Array.from(this.tasks.values()).filter(t => t.status === 'pending').length;
        const processing = Array.from(this.tasks.values()).filter(t => t.status === 'processing').length;
        const completed = Array.from(this.tasks.values()).filter(t => t.status === 'completed').length;
        
        return {
            total: this.tasks.size,
            pending,
            processing,
            completed,
            queueSize: this.taskQueue.size(),
            completedStackSize: this.completedTasks.size()
        };
    }
}

console.log('\n=== 实际应用：任务调度器 ===');
const scheduler = new TaskScheduler();

// 添加任务
scheduler.addTask('T001', '数据备份');
scheduler.addTask('T002', '生成报告');
scheduler.addTask('T003', '发送邮件');
scheduler.addTask('T004', '系统清理');

// 处理任务
scheduler.processNext();
scheduler.processNext();

// 查看状态
setTimeout(() => {
    console.log('\n📈 调度器状态:', scheduler.getStats());
}, 2000);

console.log('\n🎯 数据结构和算法学习完成！');