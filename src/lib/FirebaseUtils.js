import firebase from 'firebase';
import uuid from 'uuid';

// const firebaseConfig = {
//   apiKey: "AIzaSyAfbDF8utUFsPVEXlycK8oamMEhoHykRMM",
//   authDomain: "bitchat-blockstack.firebaseapp.com",
//   databaseURL: "https://bitchat-blockstack.firebaseio.com",
//   projectId: "bitchat-blockstack",
//   storageBucket: "bitchat-blockstack.appspot.com",
//   messagingSenderId: "538354163385",
//   appId: "1:538354163385:web:0dc146e9751bb001"
// };

// Configure Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtDo8oKHtIK9da5AsOXxoly9oZl-NzgJI",
  authDomain: "quizzical-blockstack.firebaseapp.com",
  databaseURL: "https://quizzical-blockstack.firebaseio.com",
  projectId: "quizzical-blockstack",
  storageBucket: "quizzical-blockstack.appspot.com",
  messagingSenderId: "124992953175",
  appId: "1:124992953175:web:b3639c3b3f331c31"
};

const QUIZ_COLLECTION_NAME = 'quizzes';
const RESULT_COLLECTION_NAME = 'results';
const QUIZ_TEMPLATE_COLLECTION_NAME = 'quizTemplates';

/**
 * Quiz schema
 * -----------
 * {
 *   [
 *      { id, question, options, correct }
 *   ]
 * }
 */

export default class FirebaseUtils {
  /**
   * Initialize the class
   * @param {object} that
   * @return {void}
   */
  static init (that, enablePersistence = true) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    this._db = firebase.firestore();
    if (enablePersistence) {
      firebase.firestore().enablePersistence()
        .catch(function(err) {
          console.error('Error enabling firestore persistence:', err);
          if (err.code === 'failed-precondition') {

              // Multiple tabs open, persistence can only be enabled
              // in one tab at a a time.
              // ...
          } 
          else if (err.code === 'unimplemented') {
              // The current browser does not support all of the
              // features required to enable persistence
              // ...
          }
        });
    }
  }

  /**
   * Fetches a list of all the quizzes that the user has created
   * @param void
   * @return jsonDocument `[{id: String, question: String, options: [String], correct: String}]`
   */
  static async getCreatedQuizzes (username) {
    try {
      let res = await this._db.collection(QUIZ_COLLECTION_NAME)
        .where("username", "==", username)
        .get();
      res = res.docs.map(p => ({ ...p.data(), id: p.id }));
      console.log('Created Quizzes:', res);
      return res;
    }
    catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * Fetches one of the quizzes that the user has created
   * @param void
   * @return jsonDocument `[{id: String, question: String, options: [String], correct: String}]`
   */
  static async getCreatedQuiz (quizId) {
    try {
      let res = await this._db.collection(QUIZ_COLLECTION_NAME)
        .doc(quizId)
        .get();
      console.log(`Created Quiz ${quizId}:`, res);
      return res;
    }
    catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * Saves a array of objects containing questions to the database
   * @params questionArray
   * @return void
   */
  static async saveCreatedQuiz (username, { questions, title }) {
    try {
      const id = uuid.v4();
      return await this._db.collection(QUIZ_COLLECTION_NAME)
        .doc(id)
        .set({ username, questions, title, id });
    }
    catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * Fetches a list of all the attemsps at a quiz
   * @param void
   * @return resultArray `[{id: String, email: String, score: Int}]`
   */
  static async getQuizResults (quizId) {
    try {
      let res = await this._db.collection(RESULT_COLLECTION_NAME)
        .where('quizId', '==', quizId)
        .get();
      res = res.docs.map(p => ({ ...p.data(), id: p.id }));
      console.log('Quiz Results:', res);
      return res;
    }
    catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * Saves the results of a taken quiz to the database
   * @param object resultDetails
   * @return void
   */
  static async saveQuizResult (quizId, { email, score }) {
    try {
      const id = uuid.v4();
      await this._db.collection(RESULT_COLLECTION_NAME)
        .doc(id)
        .set({ quizId, email, score, id });
    }
    catch (e) {
      console.error(e);
      throw e;
    }
  }
}