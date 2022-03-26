import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCWkUiHURqo2g0OGQkQwJn5yELAiRrKpU8',
  authDomain: 'mydemo03-blog.firebaseapp.com',
  projectId: 'mydemo03-blog',
  storageBucket: 'mydemo03-blog.appspot.com',
  messagingSenderId: '59397480871',
  appId: '1:59397480871:web:94f269a4a3004251fb5682'
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { timestamp }
export default firebaseApp.firestore()
