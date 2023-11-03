// 数据上移下移，组内移动
const up = (item, itemIndex, inner, innerIndex, treeData) => {
  const isTop = !itemIndex && !innerIndex
  const isGroupTop = itemIndex && !innerIndex
  if (isTop) {
    // 第一个数据，不允许上移
    return
  }
  if (isGroupTop) {
    // 跨组调换
    treeData[itemIndex - 1].question.push(inner)
    item.question.shift()
  } else {
    // 组内上移
    swapArray(item.question, innerIndex, innerIndex - 1)
  }
}

/**
 * 数组元素交换位置
 * @param {array} arr 数组
 * @param {number} index1 添加项目的位置
 * @param {number} index2 删除项目的位置
 * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
 */
const swapArray = (arr, index1, index2) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}
