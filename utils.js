// A function to return user's sola group id
const axios = require('axios');
require('dotenv').config()

const getGroupId = async (msg) => {
    const response = await axios.get(`${process.env.url}/event/group_list`)

    if (msg.chat.title) {
      const re = new RegExp(msg.chat.title);
      let found;
      response.data.groups.forEach(group => {
        if (re.exec(group.username)) {
          found = group;
        }
      })
    
      return found
    }
}

module.exports = getGroupId;