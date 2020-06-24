import FirebaseKeys from "./config";
import firebase from "firebase";
require("firebase/firestore");
// import database from '@react-native-firebase/database';
// const reference = database().ref('/users/123');

class Fire {
    constructor() {
    //    if (!(firebase.apps.length)){firebase.initializeApp(FirebaseKeys)};
    }
    state = {
        dataSource: ""
    };

    getAllPosts = async()  => {
        
            var db = firebase.firestore();
            var docRef = db.collection("users");
            const output = {};
        
            docRef.limit(50)
                .get()
                .then(querySnapshot => {
                    querySnapshot.docs.map(function (documentSnapshot) {
                        return (output[documentSnapshot.id] = documentSnapshot.data());
                        console.log("datasource:", documentSnapshot );
                    });
                    // this.setState({dataSource: Object.entries(output)}) ;
                    // console.log("datasource:", this.state.dataSource );
                   
                });
         
      }


    addPost = async ({ text, localUri }) => {
        const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}`);

        return new Promise((res, rej) => {
            this.firestore
                .collection("posts")
                .add({
                    text,
                    uid: this.uid,
                    timestamp: this.timestamp,
                    image: remoteUri
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    // ADD THIS THROW error
                    throw error;
                });
        });
    };

    uploadPhotoAsync = async (uri, filename) => {
        // const path = `photos/${this.uid}/${Date.now()}.jpg`;
        

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase
                .storage()
                .ref(filename)
                .put(file);

            upload.on(
                "state_changed",
                snapshot => {},
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    };

    createUser = async user => {
        let remoteUri = null;

        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            let db = this.firestore.collection("users").doc(this.uid);
            db.set({
                name: user.name,
                email: user.email,
                avatar: null
            });
            if (user.avatar) {
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`);
                db.set({avatar:remoteUri}, {merge: true});
            }
        } catch (error) {
            alert("Error: ", console.error);
            }
    
    };

    signOut = () => {
        firebase.auth().signOut();
    }
 
    get firestore() {
        return firebase.firestore();
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get timestamp() {
        return Date.now();
    }
}



Fire.shared = new Fire();
export default Fire;
