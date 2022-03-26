const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

exports.addAdminRole = functions.https.onCall((data, context) => {
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(user => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
      })
    })
    .then(() => {
      return {
        // 目前会显示undefined 不明原因
        message: `成功！ ${data.email} 已被添加为管理员。`
      }
    })
    .catch(err => {
      console.log(err, context)
    })
})
