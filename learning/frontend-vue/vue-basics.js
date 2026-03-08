// Vue.js 基础学习
// 重点：响应式系统、组件系统、指令、生命周期

console.log('🟢 Vue.js 基础学习\n');

// 1. Vue 响应式系统模拟
class VueReactive {
    constructor(data) {
        this._data = {};
        this._dependencies = new Map();
        this._init(data);
    }
    
    _init(data) {
        for (const key in data) {
            this._defineReactive(key, data[key]);
        }
    }
    
    _defineReactive(key, value) {
        const deps = new Set();
        this._dependencies.set(key, deps);
        
        Object.defineProperty(this._data, key, {
            get: () => {
                console.log(`📥 获取属性: ${key} = ${value}`);
                if (VueReactive.currentWatcher) {
                    deps.add(VueReactive.currentWatcher);
                }
                return value;
            },
            set: (newValue) => {
                if (value !== newValue) {
                    console.log(`📤 设置属性: ${key} = ${newValue} (旧值: ${value})`);
                    value = newValue;
                    
                    // 触发依赖更新
                    deps.forEach(watcher => watcher.update());
                }
            }
        });
    }
    
    $watch(expOrFn, callback) {
        const watcher = new Watcher(this, expOrFn, callback);
        return () => {
            const deps = this._dependencies.get(expOrFn);
            if (deps) {
                deps.delete(watcher);
            }
        };
    }
}

class Watcher {
    constructor(vm, expOrFn, callback) {
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.callback = callback;
        this.value = this.get();
    }
    
    get() {
        VueReactive.currentWatcher = this;
        const value = this.vm._data[this.expOrFn];
        VueReactive.currentWatcher = null;
        return value;
    }
    
    update() {
        const newValue = this.get();
        const oldValue = this.value;
        
        if (newValue !== oldValue) {
            this.value = newValue;
            this.callback(newValue, oldValue);
        }
    }
}

// 2. Vue 组件系统模拟
class VueComponent {
    constructor(options) {
        this.$options = options;
        this.$data = options.data ? options.data() : {};
        this.$props = options.props || {};
        this.$el = null;
        this._isMounted = false;
        
        // 初始化响应式数据
        this._reactive = new VueReactive(this.$data);
        
        // 代理数据访问
        this._proxyData();
        
        // 初始化生命周期
        this._callHook('beforeCreate');
        this._initMethods();
        this._initComputed();
        this._callHook('created');
    }
    
    _proxyData() {
        for (const key in this.$data) {
            Object.defineProperty(this, key, {
                get: () => this._reactive._data[key],
                set: (value) => { this._reactive._data[key] = value; }
            });
        }
    }
    
    _initMethods() {
        const methods = this.$options.methods || {};
        for (const key in methods) {
            this[key] = methods[key].bind(this);
        }
    }
    
    _initComputed() {
        const computed = this.$options.computed || {};
        for (const key in computed) {
            Object.defineProperty(this, key, {
                get: computed[key].bind(this)
            });
        }
    }
    
    _callHook(hook) {
        const handler = this.$options[hook];
        if (handler) {
            console.log(`🔄 生命周期: ${hook}`);
            handler.call(this);
        }
    }
    
    $mount(el) {
        this.$el = typeof el === 'string' ? document.querySelector(el) : el;
        this._callHook('beforeMount');
        this._render();
        this._isMounted = true;
        this._callHook('mounted');
        return this;
    }
    
    _render() {
        const template = this.$options.template || this.$options.render?.call(this);
        if (template && this.$el) {
            console.log('🎨 渲染组件:', this.$options.name || 'Anonymous');
            // 简化渲染，实际Vue使用虚拟DOM
            this.$el.innerHTML = template;
        }
    }
    
    $forceUpdate() {
        console.log('💪 强制更新组件');
        this._render();
    }
    
    $destroy() {
        this._callHook('beforeDestroy');
        this._isMounted = false;
        // 清理工作
        if (this.$el) {
            this.$el.innerHTML = '';
        }
        this._callHook('destroyed');
    }
}

// 3. Vue 指令系统模拟
class VueDirective {
    static directives = {
        // v-text 指令
        text: {
            bind(el, binding) {
                console.log(`📝 v-text 绑定: ${binding.value}`);
                el.textContent = binding.value;
            },
            update(el, binding) {
                console.log(`📝 v-text 更新: ${binding.value}`);
                el.textContent = binding.value;
            }
        },
        
        // v-model 指令（双向绑定）
        model: {
            bind(el, binding, vnode) {
                console.log(`🔗 v-model 绑定: ${binding.value}`);
                el.value = vnode.context[binding.value];
                
                el.addEventListener('input', (event) => {
                    vnode.context[binding.value] = event.target.value;
                });
            },
            update(el, binding, vnode) {
                console.log(`🔗 v-model 更新: ${binding.value}`);
                el.value = vnode.context[binding.value];
            }
        },
        
        // v-show 指令
        show: {
            bind(el, binding) {
                console.log(`👁️ v-show 绑定: ${binding.value}`);
                el.style.display = binding.value ? '' : 'none';
            },
            update(el, binding) {
                console.log(`👁️ v-show 更新: ${binding.value}`);
                el.style.display = binding.value ? '' : 'none';
            }
        },
        
        // v-if 指令（简化版）
        if: {
            bind(el, binding, vnode) {
                console.log(`❓ v-if 绑定: ${binding.value}`);
                if (!binding.value) {
                    el.style.display = 'none';
                }
            },
            update(el, binding) {
                console.log(`❓ v-if 更新: ${binding.value}`);
                el.style.display = binding.value ? '' : 'none';
            }
        },
        
        // v-for 指令（简化版）
        for: {
            bind(el, binding, vnode) {
                console.log(`🔄 v-for 绑定: ${binding.value}`);
                const items = vnode.context[binding.value];
                this.renderList(el, items);
            },
            update(el, binding, vnode) {
                console.log(`🔄 v-for 更新: ${binding.value}`);
                const items = vnode.context[binding.value];
                this.renderList(el, items);
            },
            renderList(el, items) {
                el.innerHTML = '';
                items.forEach((item, index) => {
                    const li = document.createElement('li');
                    li.textContent = `${index + 1}. ${item}`;
                    el.appendChild(li);
                });
            }
        }
    };
    
    static applyDirective(el, name, value, vnode) {
        const directive = VueDirective.directives[name];
        if (directive) {
            const binding = { value };
            directive.bind(el, binding, vnode);
            
            // 监听数据变化
            if (typeof value === 'string' && vnode.context) {
                vnode.context.$watch(value, (newVal) => {
                    directive.update(el, { value: newVal }, vnode);
                });
            }
        }
    }
}

// 4. 实际应用：购物车组件
class ShoppingCart extends VueComponent {
    constructor(options) {
        super({
            name: 'ShoppingCart',
            data() {
                return {
                    products: [
                        { id: 1, name: 'iPhone 15', price: 7999, quantity: 1, selected: true },
                        { id: 2, name: 'MacBook Pro', price: 12999, quantity: 1, selected: true },
                        { id: 3, name: 'AirPods Pro', price: 1999, quantity: 2, selected: false },
                        { id: 4, name: 'iPad Air', price: 4799, quantity: 1, selected: true }
                    ],
                    discount: 0.1, // 10%折扣
                    shippingFee: 0
                };
            },
            
            computed: {
                selectedProducts() {
                    return this.products.filter(p => p.selected);
                },
                
                subtotal() {
                    return this.selectedProducts.reduce((sum, product) => {
                        return sum + (product.price * product.quantity);
                    }, 0);
                },
                
                discountAmount() {
                    return this.subtotal * this.discount;
                },
                
                total() {
                    return this.subtotal - this.discountAmount + this.shippingFee;
                },
                
                itemCount() {
                    return this.selectedProducts.reduce((sum, product) => {
                        return sum + product.quantity;
                    }, 0);
                }
            },
            
            methods: {
                increaseQuantity(product) {
                    product.quantity++;
                    console.log(`➕ 增加数量: ${product.name}`);
                },
                
                decreaseQuantity(product) {
                    if (product.quantity > 1) {
                        product.quantity--;
                        console.log(`➖ 减少数量: ${product.name}`);
                    }
                },
                
                removeProduct(productId) {
                    const index = this.products.findIndex(p => p.id === productId);
                    if (index !== -1) {
                        console.log(`🗑️ 移除商品: ${this.products[index].name}`);
                        this.products.splice(index, 1);
                    }
                },
                
                toggleSelection(product) {
                    product.selected = !product.selected;
                    console.log(`${product.selected ? '✅' : '❌'} 选择商品: ${product.name}`);
                },
                
                applyCoupon() {
                    this.discount = 0.2; // 20%折扣
                    console.log('🎫 应用优惠券: 20%折扣');
                },
                
                checkout() {
                    console.log('💰 结算购物车');
                    console.log('📦 订单详情:', {
                        商品数量: this.itemCount,
                        小计: this.subtotal,
                        折扣: this.discountAmount,
                        运费: this.shippingFee,
                        总计: this.total
                    });
                    
                    alert(`订单提交成功！总计: ¥${this.total.toFixed(2)}`);
                }
            },
            
            created() {
                console.log('🛒 购物车组件创建完成');
            },
            
            mounted() {
                console.log('🛒 购物车组件已挂载');
            },
            
            template: `
                <div class="shopping-cart">
                    <h2>🛒 购物车 ({{ itemCount }}件商品)</h2>
                    
                    <div class="cart-items">
                        <div v-for="product in products" class="cart-item">
                            <input type="checkbox" v-model="product.selected">
                            <span class="product-name">{{ product.name }}</span>
                            <span class="product-price">¥{{ product.price }}</span>
                            <div class="quantity-controls">
                                <button @click="decreaseQuantity(product)">-</button>
                                <span>{{ product.quantity }}</span>
                                <button @click="increaseQuantity(product)">+</button>
                            </div>
                            <span class="item-total">¥{{ product.price * product.quantity }}</span>
                            <button @click="removeProduct(product.id)" class="remove-btn">删除</button>
                        </div>
                    </div>
                    
                    <div class="cart-summary">
                        <div class="summary-row">
                            <span>小计:</span>
                            <span>¥{{ subtotal }}</span>
                        </div>
                        <div class="summary-row">
                            <span>折扣 ({{ discount * 100 }}%):</span>
                            <span>-¥{{ discountAmount }}</span>
                        </div>
                        <div class="summary-row">
                            <span>运费:</span>
                            <span>¥{{ shippingFee }}</span>
                        </div>
                        <div class="summary-row total">
                            <span>总计:</span>
                            <span>¥{{ total }}</span>
                        </div>
                    </div>
                    
                    <div class="cart-actions">
                        <button @click="applyCoupon" class="coupon-btn">使用优惠券</button>
                        <button @click="checkout" class="checkout-btn">去结算</button>
                    </div>
                </div>
            `
        });
    }
}

// 5. Vue 实例创建和使用
console.log('=== 1. Vue 响应式系统演示 ===');
const reactiveDemo = new VueReactive({
    message: 'Hello Vue!',
    count: 0
});

console.log('初始数据:', reactiveDemo._data);

// 监听数据变化
const unwatch = reactiveDemo.$watch('message', (newVal, oldVal) => {
    console.log(`👀 监听器: message 从 "${oldVal}" 变为 "${newVal}"`);
});

// 修改数据
reactiveDemo._data.message = 'Hello Vue.js!';
reactiveDemo._data.count = 42;

console.log('\n=== 2. Vue 组件系统演示 ===');
const cart = new ShoppingCart({});

console.log('\n购物车数据:');
console.log('- 商品列表:', cart.products);
console.log('- 选中商品:', cart.selectedProducts);
console.log('- 小计:', cart.subtotal);
console.log('- 总计:', cart.total);

// 模拟用户交互
console.log('\n模拟用户交互:');
cart.increaseQuantity(cart.products[0]);
cart.toggleSelection(cart.products[2]);
cart.applyCoupon();

console.log('\n更新后的数据:');
console.log('- 小计:', cart.subtotal);
console.log('- 折扣:', cart.discountAmount);
console.log('- 总计:', cart.total);

// 6. Vue vs React 对比总结
console.log('\n=== 3. Vue.js vs React 对比总结 ===');
console.log('🟢 Vue.js 特点:');
console.log('   • 渐进式框架，易于上手');
console.log('   • 基于模板的语法，更接近原生HTML');
console.log('   • 响应式系统自动追踪依赖');
console.log('   • 指令系统提供声明式DOM操作');
console.log('   • 单文件组件(.vue)组织代码');

console.log('\n⚛️ React 特点:');
console.log('   • 声明式UI，组件即函数');
console.log('   • JSX语法，JavaScript中写HTML');
console.log('   • 虚拟DOM，高效更新');
console.log('   • 单向数据流，状态管理清晰');
console.log('   • Hooks简化状态和副作用管理');

console.log('\n🎯 适用场景:');
console.log('   • Vue.js: 快速原型、中小型项目、团队经验较少');
console.log('   • React: 大型应用、复杂交互、需要高度定制');

console.log('\n🔄 学习收获:');
console.log('   ✅ 理解了Vue的响应式原理');
console.log('   ✅ 掌握了Vue组件生命周期');
console.log('   ✅ 学会了Vue指令系统');
console.log('   ✅ 实践了完整的购物车应用');
console.log('   ✅ 对比了Vue和React的设计哲学');

console.log('\n🎉 Vue.js 基础学习完成！');
console.log('\n📚 第二阶段前端技术学习总结:');
console.log('   ✅ React: 组件化、Hooks、状态管理');
console.log('   ✅ Vue.js: 响应式、指令、单文件组件');
console.log('   ✅ 对比分析: 理解不同框架的设计思想');
console.log('   ✅ 实际应用: 构建了用户仪表板和购物车应用');

console.log('\n🚀 准备进入下一阶段：后端技术学习！');