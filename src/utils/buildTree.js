export function buildTree(items, parentId = null) {
    const tree = []
    items.forEach(item => {
      if (item.parent_id === parentId) {
        const children = buildTree(items, item.kode_menu)
        item.children = children || []   // ← wajib bikin children selalu ada
        tree.push(item)
      }
    })
    return tree
  }
