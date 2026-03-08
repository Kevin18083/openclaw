// React 基础学习
// 重点：组件化、状态管理、生命周期、Hooks

console.log('⚛️ React 基础学习\n');

// 模拟 React 的核心概念（简化版）
class ReactComponent {
    constructor(props) {
        this.props = props;
        this.state = {};
        this._isMounted = false;
    }
    
    setState(updater, callback) {
        // 模拟 React 的 setState
        const newState = typeof updater === 'function' 
            ? updater(this.state) 
            : updater;
        
        this.state = { ...this.state, ...newState };
        
        if (this._isMounted) {
            console.log('🔄 状态更新，触发重新渲染');
            this.render();
            
            if (callback) {
                callback();
            }
        }
    }
    
    componentDidMount() {
        this._isMounted = true;
        console.log('✅ 组件已挂载');
    }
    
    componentWillUnmount() {
        this._isMounted = false;
        console.log('🗑️ 组件即将卸载');
    }
    
    render() {
        // 子类需要重写此方法
        throw new Error('render() 方法必须被重写');
    }
}

// 1. 类组件示例
class Counter extends ReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            count: props.initialCount || 0
        };
    }
    
    increment = () => {
        this.setState(prevState => ({
            count: prevState.count + 1
        }));
    }
    
    decrement = () => {
        this.setState(prevState => ({
            count: prevState.count - 1
        }));
    }
    
    reset = () => {
        this.setState({ count: 0 });
    }
    
    componentDidMount() {
        super.componentDidMount();
        console.log('📊 Counter 组件已挂载，初始值:', this.state.count);
    }
    
    render() {
        return {
            type: 'div',
            props: {
                className: 'counter',
                children: [
                    {
                        type: 'h2',
                        props: { children: `计数器: ${this.state.count}` }
                    },
                    {
                        type: 'div',
                        props: {
                            className: 'controls',
                            children: [
                                {
                                    type: 'button',
                                    props: {
                                        onClick: this.decrement,
                                        children: '减少'
                                    }
                                },
                                {
                                    type: 'button',
                                    props: {
                                        onClick: this.reset,
                                        children: '重置'
                                    }
                                },
                                {
                                    type: 'button',
                                    props: {
                                        onClick: this.increment,
                                        children: '增加'
                                    }
                                }
                            ]
                        }
                    },
                    {
                        type: 'p',
                        props: {
                            children: `当前计数: ${this.state.count}`
                        }
                    }
                ]
            }
        };
    }
}

// 2. 函数组件模拟（使用 Hooks）
function useState(initialValue) {
    let state = initialValue;
    let setters = [];
    
    function setState(newValue) {
        state = typeof newValue === 'function' ? newValue(state) : newValue;
        
        // 触发所有监听器
        setters.forEach(setter => setter(state));
        console.log('🎣 Hook 状态更新:', state);
    }
    
    function getState() {
        return state;
    }
    
    function addSetter(setter) {
        setters.push(setter);
    }
    
    return [getState, setState, addSetter];
}

function useEffect(callback, dependencies) {
    // 简化版的 useEffect
    console.log('🔧 执行副作用效果');
    const cleanup = callback();
    
    return () => {
        if (cleanup && typeof cleanup === 'function') {
            console.log('🧹 清理副作用');
            cleanup();
        }
    };
}

// 函数组件示例
function TodoApp(props) {
    const [getTodos, setTodos, addTodoSetter] = useState([]);
    const [getInput, setInput, addInputSetter] = useState('');
    
    // 模拟组件渲染
    function render() {
        const todos = getTodos();
        const input = getInput();
        
        console.log('\n📝 TodoApp 渲染:');
        console.log('  输入框内容:', input);
        console.log('  待办事项:', todos);
        
        return {
            type: 'div',
            props: {
                className: 'todo-app',
                children: [
                    {
                        type: 'h2',
                        props: { children: '待办事项列表' }
                    },
                    {
                        type: 'div',
                        props: {
                            className: 'input-section',
                            children: [
                                {
                                    type: 'input',
                                    props: {
                                        value: input,
                                        onChange: (e) => setInput(e.target.value),
                                        placeholder: '输入待办事项...'
                                    }
                                },
                                {
                                    type: 'button',
                                    props: {
                                        onClick: () => {
                                            if (input.trim()) {
                                                setTodos(prev => [...prev, {
                                                    id: Date.now(),
                                                    text: input.trim(),
                                                    completed: false
                                                }]);
                                                setInput('');
                                            }
                                        },
                                        children: '添加'
                                    }
                                }
                            ]
                        }
                    },
                    {
                        type: 'ul',
                        props: {
                            children: todos.map(todo => ({
                                type: 'li',
                                props: {
                                    key: todo.id,
                                    className: todo.completed ? 'completed' : '',
                                    children: [
                                        {
                                            type: 'span',
                                            props: {
                                                onClick: () => {
                                                    setTodos(prev => prev.map(t =>
                                                        t.id === todo.id 
                                                            ? { ...t, completed: !t.completed }
                                                            : t
                                                    ));
                                                },
                                                children: todo.text
                                            }
                                        },
                                        {
                                            type: 'button',
                                            props: {
                                                onClick: () => {
                                                    setTodos(prev => prev.filter(t => t.id !== todo.id));
                                                },
                                                children: '删除'
                                            }
                                        }
                                    ]
                                }
                            }))
                        }
                    }
                ]
            }
        };
    }
    
    // 模拟组件挂载
    console.log('✅ TodoApp 函数组件初始化');
    
    // 添加状态监听器（模拟 React 的重新渲染）
    addTodoSetter(() => {
        console.log('🔄 TodoApp 状态变化，触发重新渲染');
        render();
    });
    
    addInputSetter(() => {
        console.log('🔄 输入框状态变化');
        render();
    });
    
    // 模拟 useEffect
    const cleanup = useEffect(() => {
        console.log('📋 加载初始待办事项...');
        
        // 模拟 API 调用
        setTimeout(() => {
            setTodos([
                { id: 1, text: '学习 React', completed: true },
                { id: 2, text: '掌握 Hooks', completed: false },
                { id: 3, text: '构建项目', completed: false }
            ]);
        }, 1000);
        
        return () => {
            console.log('🧹 清理 TodoApp 资源');
        };
    }, []);
    
    return render();
}

// 3. 高阶组件示例
function withLogger(WrappedComponent) {
    return class extends ReactComponent {
        constructor(props) {
            super(props);
            console.log(`📝 高阶组件包装: ${WrappedComponent.name}`);
        }
        
        componentDidMount() {
            console.log(`✅ ${WrappedComponent.name} 已挂载`);
        }
        
        componentWillUnmount() {
            console.log(`🗑️ ${WrappedComponent.name} 即将卸载`);
        }
        
        render() {
            return {
                type: WrappedComponent,
                props: this.props
            };
        }
    };
}

// 4. Context API 模拟
class ThemeContext {
    constructor(defaultValue) {
        this._value = defaultValue;
        this._consumers = [];
    }
    
    get value() {
        return this._value;
    }
    
    set value(newValue) {
        this._value = newValue;
        this._consumers.forEach(consumer => consumer(newValue));
    }
    
    subscribe(consumer) {
        this._consumers.push(consumer);
        return () => {
            const index = this._consumers.indexOf(consumer);
            if (index > -1) {
                this._consumers.splice(index, 1);
            }
        };
    }
}

// 主题上下文
const Theme = new ThemeContext('light');

// 使用 Context 的组件
class ThemedButton extends ReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            theme: Theme.value
        };
        
        this.unsubscribe = Theme.subscribe((newTheme) => {
            this.setState({ theme: newTheme });
        });
    }
    
    componentWillUnmount() {
        super.componentWillUnmount();
        this.unsubscribe();
    }
    
    toggleTheme = () => {
        Theme.value = this.state.theme === 'light' ? 'dark' : 'light';
    }
    
    render() {
        const theme = this.state.theme;
        
        return {
            type: 'button',
            props: {
                onClick: this.toggleTheme,
                style: {
                    backgroundColor: theme === 'light' ? '#fff' : '#333',
                    color: theme === 'light' ? '#000' : '#fff',
                    padding: '10px 20px',
                    border: `2px solid ${theme === 'light' ? '#ccc' : '#666'}`,
                    borderRadius: '5px',
                    cursor: 'pointer'
                },
                children: `切换到 ${theme === 'light' ? '深色' : '浅色'} 模式`
            }
        };
    }
}

// 5. 实际应用：用户仪表板
class UserDashboard extends ReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            error: null,
            searchTerm: ''
        };
    }
    
    componentDidMount() {
        super.componentDidMount();
        this.fetchUsers();
    }
    
    fetchUsers = async () => {
        console.log('🌐 开始获取用户数据...');
        
        try {
            // 模拟 API 调用
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const mockUsers = [
                { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', active: true },
                { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑', active: true },
                { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户', active: false },
                { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '用户', active: true },
                { id: 5, name: '钱七', email: 'qianqi@example.com', role: '编辑', active: true }
            ];
            
            this.setState({
                users: mockUsers,
                loading: false,
                error: null
            });
            
            console.log('✅ 用户数据获取成功');
            
        } catch (error) {
            this.setState({
                loading: false,
                error: '获取用户数据失败'
            });
            console.error('❌ 获取用户数据失败:', error);
        }
    }
    
    handleSearch = (event) => {
        this.setState({ searchTerm: event.target.value });
    }
    
    toggleUserStatus = (userId) => {
        this.setState(prevState => ({
            users: prevState.users.map(user =>
                user.id === userId
                    ? { ...user, active: !user.active }
                    : user
            )
        }));
    }
    
    getFilteredUsers() {
        const { users, searchTerm } = this.state;
        
        if (!searchTerm.trim()) {
            return users;
        }
        
        const term = searchTerm.toLowerCase();
        return users.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.role.toLowerCase().includes(term)
        );
    }
    
    render() {
        const { loading, error, searchTerm } = this.state;
        const filteredUsers = this.getFilteredUsers();
        
        if (loading) {
            return {
                type: 'div',
                props: {
                    className: 'loading',
                    children: '⏳ 加载中...'
                }
            };
        }
        
        if (error) {
            return {
                type: 'div',
                props: {
                    className: 'error',
                    children: `❌ ${error}`
                }
            };
        }
        
        return {
            type: 'div',
            props: {
                className: 'user-dashboard',
                children: [
                    {
                        type: 'h2',
                        props: { children: '用户管理仪表板' }
                    },
                    {
                        type: 'div',
                        props: {
                            className: 'search-bar',
                            children: {
                                type: 'input',
                                props: {
                                    type: 'text',
                                    placeholder: '搜索用户...',
                                    value: searchTerm,
                                    onChange: this.handleSearch
                                }
                            }
                        }
                    },
                    {
                        type: 'div',
                        props: {
                            className: 'stats',
                            children: [
                                {
                                    type: 'p',
                                    props: {
                                        children: `总用户数: ${filteredUsers.length}`
                                    }
                                },
                                {
                                    type: 'p',
                                    props: {
                                        children: `活跃用户: ${filteredUsers.filter(u => u.active).length}`
                                    }
                                }
                            ]
                        }
                    },
                    {
                        type: 'table',
                        props: {
                            className: 'user-table',
                            children: [
                                {
                                    type: 'thead',
                                    props: {
                                        children: {
                                            type: 'tr',
                                            props: {
                                                children: [
                                                    'ID', '姓名', '邮箱', '角色', '状态', '操作'
                                                ].map(header => ({
                                                    type: 'th',
                                                    props: { children: header }
                                                }))
                                            }
                                        }
                                    }
                                },
                                {
                                    type: 'tbody',
                                    props: {
                                        children: filteredUsers.map(user => ({
                                            type: 'tr',
                                            props: {
                                                key: user.id,
                                                className: user.active ? 'active' : 'inactive',
                                                children: [
                                                    { type: 'td', props: { children: user.id } },
                                                    { type: 'td', props: { children: user.name } },
                                                    { type: 'td', props: { children: user.email } },
                                                    { type: 'td', props: { children: user.role } },
                                                    {
                                                        type: 'td',
                                                        props: {
                                                            children: user.active ? '✅ 活跃' : '❌ 禁用'
                                                        }
                                                    },
                                                    {
                                                        type: 'td',
                                                        props: {
                                                            children: {
                                                                type: 'button',
                                                                props: {
                                                                    onClick: () => this.toggleUserStatus(user.id),
                                                                    children: user.active ? '禁用' : '激活'
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }))
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        };
    }
}

// 主函数：演示所有 React 概念
function main() {
    console.log('🚀 React 基础学习开始\n');
    
    // 1. 演示类组件
    console.log('=== 1. 类组件示例 ===');
    const counter = new Counter({ initialCount: 5 });
    counter.componentDidMount();
    console.log('初始渲染:', JSON.stringify(counter.render(), null, 2));
    
    // 模拟用户交互
    console.log('\n模拟用户点击增加按钮:');
    counter.increment();
    
    console.log('\n模拟用户点击重置按钮:');
    counter.reset();
    
    // 2. 演示函数组件
    console.log('\n=== 2. 函数组件示例 ===');
    const todoApp = TodoApp({});
    
    // 3. 演示高阶组件
    console.log('\n=== 3. 高阶组件示例 ===');
    const LoggedCounter = withLogger(Counter);
    const loggedCounter = new LoggedCounter({ initialCount: 10 });
    loggedCounter.componentDidMount();
    
    // 4. 演示 Context API
    console.log('\n=== 4. Context API 示例 ===');
    const themedButton = new ThemedButton({});
    console.log('初始主题按钮:', JSON.stringify(themedButton.render(), null, 2));
    
    // 模拟切换主题
    console.log('\n模拟切换主题:');
    themedButton.toggleTheme();
    
    // 5. 演示实际应用
    console.log('\n=== 5. 实际应用：用户仪表板 ===');
    const dashboard = new UserDashboard({});
    dashboard.componentDidMount();
    
    // 等待数据加载完成
    setTimeout(() => {
        console.log('\n用户仪表板渲染结果:');
        console.log(JSON.stringify(dashboard.render(), null, 2));
        
        console.log('\n🎉 React 基础学习完成！');
        console.log('\n📚 学习总结:');
        console.log('✅ 掌握了 React 核心概念');
        console.log('✅ 理解了组件化开发思想');
        console.log('✅ 学会了状态管理和生命周期');
        console.log('✅ 实践了 Hooks 和 Context API');
        console.log('✅ 构建了完整的用户仪表板应用');
        
    }, 1000);
}

// 运行主函数
main();