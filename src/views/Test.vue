<template>
    <div class="test">
        <p>功能一：验证setup自动解开ref:{{refTest}}{{reactiveTest.foo}}</p>
    </div>
</template>

<script>
import { ref, reactive, watchEffect, computed, readonly } from 'vue'
export default {
    //setup方法：创建组件实例，然后初始化 props ，紧接着就调用setup 函数。
    //从生命周期钩子的视角来看，它会在 beforeCreate 钩子之前被调用
    //setup 返回的 ref 在模板中会自动解开，不需要写 .value
    //也可以返回一个函数，函数中也能使用当前 setup 函数作用域中的响应式数据：

    //在setup函数之前初始化的数据，作为函数的第一个参数
    //props对象是响应式的,使用watchEffect或者watch可以观察和相应props的更新
    //开发过程中，props 对象对用户空间代码是不可变的（用户代码尝试修改 props 时会触发警告）

    //关注点：为什么要将props 作为第一个参数，而不是包含在上下文中？
    //组件使用 props 的场景更多，有时候甚至只使用 props
    //将 props 独立出来作为第一个参数，可以让 TypeScript 对 props 单独做类型推导，不会和上下文中的其他属性相混淆。
    //这也使得 setup 、 render 和其他使用了 TSX 的函数式组件的签名保持一致。

    props: {
        name: String
    },
    setup(props, context) {
        /* setup传入参数 */
        //setup函数接收 props 作为其第一个参数
        console.log(props.name)
        watchEffect(() => {
            console.log(`name is: ` + props.name)
            //结构props对象会使其失去响应
            console.log(`name is: ` + name) // Will not be reactive!
        })

        //第二个参数提供了一个上下文对象，从原来 2.x 中 this 选择性地暴露了一些 property
        //attrs 和 slots 都是内部组件实例上对应项的代理，可以确保在更新后仍然是最新值。所以可以解构，无需担心后面访问到过期的值
        console.log(context.attrs)
        console.log(context.slots)
        console.log(context.emit)

        //关注点：this 在 setup() 中不可用
        //由于 setup() 在解析 2.x 选项前被调用，setup() 中的 this 将与 2.x 选项中的 this 完全不同。
        //同时在 setup() 和 2.x 选项中使用 this 时将造成混乱。

        /* ref和reactive */
        //关注点：1.ref和reactive的底层实现 2.ref和reactive的异同

        //接收一个参数值并返回一个响应式且可改变的 ref 对象。ref 对象拥有一个指向内部值的单一属性 .value。
        //个人暂时偏向使用ref，感觉官网也是这个趋势
        //
        const refTest = ref(0)

        //接收一个普通对象然后返回该普通对象的响应式代理。等同于 2.x 的 Vue.observable()
        //响应式转换是“深层的”：会影响对象内部所有嵌套的属性。基于 ES2015 的 Proxy 实现，返回的代理对象不等于原始对象。建议仅使用代理对象而避免依赖原始对象。
        const reactiveTest = reactive({ foo: 'bar' })
        //setup 返回的 ref 在模板中会自动解开，不需要写 .value，因此在渲染模板中可以直接使用refTest，而reactiveTest不能直接使用

        //当 ref 作为 reactive 对象的 property 被访问或修改时，也将自动解套 value 值，其行为类似普通属性：
        const refTestOther = reactive({
            refTest
        })
        console.log(refTestOther.refTest) //此处自动结构，不需要写成refTestOther.refTest.value
        refTestOther.refTest = 1
        console.log(refTestOther.refTest)

        //注意如果将一个新的 ref 分配给现有的 ref， 将替换旧的 ref：
        //问题：官网此处可以直接进行赋值refTestOther.refTest = otherCount，但是本地运行时候需要加上。value，并没有自动解套value，造成后续refTest.value也响应的变化，没有替换refTestOther.refTest的指向，只替换了值
        const otherCount = ref(2)

        refTestOther.refTest = otherCount.value
        console.log(refTestOther.refTest) // 2
        console.log(refTest.value) // 2

        //此处可以看到，赋值value的还仅赋了值，并没有改变引用，因此增加otherCount并没有改变refTestOther.refTest
        otherCount.value++
        console.log(refTestOther.refTest) // 2
        console.log(refTest.value) // 2

        //注意当嵌套在 reactive Object 中时，ref 才会解套。从 Array 或者 Map 等原生集合类中访问 ref 时，不会自动解套

        /* computed */
        //传入一个 getter 函数，返回一个默认不可手动修改的 ref 对象，修改会触发warning
        const count = ref(1)
        const plusOne = computed(() => count.value + 1)
        console.log(plusOne.value) // 2

        //也可以传入一个拥有 get 和 set 函数的对象，创建一个可手动修改的计算状态。
        const plusOne1 = computed({
            get: () => count.value + 1,
            set: val => {
                count.value = val - 1
            }
        })

        plusOne1.value = 1
        console.log(count.value) // 0

        /* readonly */
        //传入一个对象（响应式或普通）或 ref，返回一个原始对象的只读代理。一个只读的代理是“深层的”，对象内部任何嵌套的属性也都是只读的。
        const original = reactive({ count: 0 })

        const copy = readonly(original)

        watchEffect(() => {
            // 依赖追踪
            console.log(copy.count)
        })

        // original 上的修改会触发 copy 上的侦听
        original.count++

        // 无法修改 copy 并会被警告
        // copy.count++ // warning!

        /* watchEffect */
        //立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数
        watchEffect(() => console.log(count.value)) // -> 打印出 0
        setTimeout(() => {
            count.value++
            // -> 打印出 1（因为上述侦听依赖了count.value，因此在count.value更新的时候会再次触发watchEffect中的方法打印）
        }, 100)

        //停止侦听
        //当 watchEffect 在组件的 setup() 函数或生命周期钩子被调用时， 侦听器会被链接到该组件的生命周期，并在组件卸载时自动停止。
        //在一些情况下，也可以显式调用返回值以停止侦听：
        const stop = watchEffect(() => {
            /* ... */
        })
        // 之后
        stop()

        // 清除副作用（需要理解下这个东西的定义）
        //

        /* watch */
        //关注点：wacth和watchEffect的区别和不同使用情况

        // 暴露给模板

        // 返回jsx渲染模式
        // return () => h('div', [refTest.value, reactiveTest.foo]) //需要引入h

        //关注点：1.为什么一定需要return而不使用自动抛出setup中定义的内容
        return {
            refTest,
            reactiveTest,
            refTestOther
        }
    }
}
</script>

<style lang="less" scoped>
.test {
    color: red;
}
</style>