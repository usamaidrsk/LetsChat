import firebase from "firebase";

const FileModule =  {
    // namespaced: true,
    state: () => ({
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/chatapp-39b2f.appspot.com/o/profile%2FavatarM.jpg?alt=media&token=2f46c065-f111-4e92-a532-fd03af80f98d",
        files: null,
        images: [],
        group_image_url:'https://firebasestorage.googleapis.com/v0/b/whatchat-4c8cf.appspot.com/o/group_profile%2Fgroup%20icon.jpg?alt=media&token=2a2ef2b7-31fb-4677-a1d6-664c48791542'
    }),
    mutations: {
        setImageUrl (state, payload) {
            state.imageUrl = payload
        },
        setFiles (state, payload) {
            state.files = payload
        },
        setImages(state,payload){
            state.images = payload
        },
        setGroupImageURL(state,payload){
            state.group_image_url = payload
        },
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
                    let imageUrl = fileReader.result;
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
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        },
        readFileMessage({commit}){
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                let file=files[i]
                if (!file.type.match("image")) {
                    continue;
                }
                let picReader = new FileReader();
                let images =[]
                picReader.addEventListener('load',event =>{
                    let picFile = event.target;
                    images.push(picFile.result)
                });
                commit('setImages', images)
                picReader.readAsDataURL(file)
                
            }
        },
        uploadChatImages({commit},payload){
            return new Promise((resolve, reject)=>{
                let number = Math.random()
                let uniq_id = number.toString(36).substr(2,9);
                let storageRef = firebase.storage().ref('chat_images/'+`${uniq_id}.png`)
                let uploadTask = storageRef.putString(payload, 'data_url',{
                    contentType: "image/png"
                })
                
                uploadTask.on('state_changed', function(snapshot){
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        },
        images(state) {
            return state.images
        },
        group_image_url(state){
            return state.group_image_url
        }
    }
  }
export default FileModule