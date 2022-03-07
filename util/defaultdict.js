class DefaultDict {
  constructor(defaultVal) {
    return new Proxy({}, {
      get: function(target, name) {
        if (!(name in target))
            target[name] = defaultVal()
        return target[name]
        },
      has: (target, name) => name in target
    })
  }
}

export {DefaultDict}