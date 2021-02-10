export function requestAndFriends(payload) {
    let arr = []
    for (let itm in payload) {
      arr.push(payload[itm].uid)
    }
    arr = [...new Set(arr)]
    let newObj = {}
    arr.forEach(itm => {
      for (let i in payload) {
        if (itm === payload[i].uid) {
          newObj[itm] = payload[i]
        }
      }
    })
    return newObj
}

export function newContacts(payload, state) {
    let newContacts = {}
    let friends = []
    for (let frd in state.friends) {
        friends.push(state.friends[frd].uid)
    }
    let users = Object.keys(payload)
    users.forEach(user => {
        if (friends.includes(user)) {
            // 
        } else {
            newContacts[user] = payload[user]
        }
    })
    return newContacts
}