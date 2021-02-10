import firebase from "firebase";

const FileModule =  {
    // namespaced: true,
    state: () => ({
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/chatapp-39b2f.appspot.com/o/profile%2Fav3.png?alt=media&token=e2eaa797-9255-4ced-932e-e49beafe4128",
        files: null
    }),
    mutations: {
        setImageUrl (state, payload) {
            state.imageUrl = payload
        },
        setFiles (state, payload) {
            state.files = payload
        }
    },
    actions: {
        readFile ({commit}, action_name) {
            const files = event.target.files
            commit('setFiles', files)
            const fileReader = new FileReader()
            let file = files[0]
            if (file['size'] < 200000) {
                fileReader.readAsDataURL(file)
                fileReader.addEventListener('load', () => {
                    var imageUrl = fileReader.result;
                    commit(action_name,imageUrl)
                })
            } else {
                commit('setAlertMessage', 'The image size is greater than 200KB')
                return
            }
        },
        uploadFile ({commit, state}, filepath) {
            return new Promise((resolve, reject) => {
                let file = state.files[0]
                let storageRef = firebase.storage().ref(filepath + file.name)
                let uploadTask = storageRef.put(file)
                uploadTask.on('state_changed', function(snapshot){
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                 
                  }, function(error) {
                    // Handle unsuccessful uploads
                    reject(error)
                  }, function() {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                      resolve(downloadURL)
                    });
                });
            })
        }
    },
    getters: { 
        getImageUrl (state) {
            return state.imageUrl
        },
        getFiles (state) {
            return state.files
        }
    }
  }
export default FileModule