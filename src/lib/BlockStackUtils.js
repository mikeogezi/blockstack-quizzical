import {
  UserSession,
  AppConfig
} from 'blockstack';

export default class BlockStackUtils {
  static init (that) {
    const appConfig = new AppConfig(['store_write', 'publish_data']);
    that.userSession = new UserSession({ appConfig });
  }

  static isSignedInOrPending (that) {
    // return true;
    BlockStackUtils._assertInit(that);
    const session = that.userSession;

    if (session.isUserSignedIn()) {
      console.log('User Signed In');
      return true;
    }
    else if (!session.isUserSignedIn() && session.isSignInPending()) {
      console.log('User Sign In Pending');
      session.handlePendingSignIn()
        .then(user => console.log('User Data', user));
      
      return true;
    }
    else {
      return false;
    }
  }

  static signIn (that) {
    BlockStackUtils._assertInit(that);
    const origin = window.location.origin;
    that.userSession.redirectToSignIn(`${origin}/app/`);
  }

  static _assertInit (that) {
    if (!that.userSession) {
      BlockStackUtils.init(that);
    }
  }

  static logOut (that) {
    BlockStackUtils._assertInit(that);
    that.userSession.signUserOut('/');
  }

  // Query: https://core.blockstack.org/v1/search?query=okibeogezi.id.blockstack
  static async checkIfUserExists (fullName) {
    try {
      const res = await fetch(`https://core.blockstack.org/v1/search?query=${fullName}`);
      return res.results.length !== 0;
    }
    catch (e) {
      console.error(e);
    }
  }

  static _genFriendsFileName (that) {
    return 'friends.json';
  }

  static _genMessagesFileName (that, from, to) {
    const fileName = from > to ? `${from}-and-${to}` : `${to}-and-${from}`;
    console.log('Messages File Name', fileName);
    return fileName;
  }

  /**
   * loads all a user's friends
   * by reading from a gaia file that conatins all the friends
   * @param {*} that The context of the component
   */
  static async loadFriends (that) {
    return await BlockStackUtils._demoLoadFriends();
    BlockStackUtils._assertInit(that);
    const fileStr = await that.userSession
      .getFile(BlockStackUtils._genFriendsFileName(that), { decrypt: true });
    return JSON.parse(fileStr);
  }

  static async addFriend (that, name) {
    BlockStackUtils._assertInit(that);
    // Read
    const fileStr = await that.userSession
      .getFile(BlockStackUtils._genFriendsFileName(that), { decrypt: true }) || '[]';
    const friends = JSON.parse(fileStr);
    // Modify
    friends.push({ name });
    // Write
    await that.userSession
      .putFile(BlockStackUtils._genFriendsFileName(that), JSON.stringify(friends), 
        { encrypt: true });
    return friends;
  }

  static _getUsername (that) {
    return that.userSession.store.getSessionData().username;
  }

  /**
   * loads all the messages that have been sent between two users
   * by reading from a gaia file that stores the messages between the two users 
   * @param {*} that The context of the component
   * @param {*} from Senders fullName
   * @param {*} to Receivers fullName
   */
  static async loadMessages (that, from, to) {
    return await BlockStackUtils._demoLoadMessages();
    const username = BlockStackUtils._getUsername(that);
    BlockStackUtils._assertInit(that);
    const fileStr = await that.userSession
      .getFile(BlockStackUtils._genMessagesFileName(that), { 
        decrypt: false,
        username
      }) || '[]';
    return JSON.parse(fileStr);
  }

  /**
   * Sends a message from one user to another 
   * by writing to a gaia file that stores the messages between two people
   * @param {*} that The context of the component
   * @param {*} messageBody The text message being sent
   * @param {*} from Sender fullName
   * @param {*} to Receiver fullName
   */
  static async sendMessage (that, messageBody, from, to) {
    const username = BlockStackUtils._getUsername(that);
    BlockStackUtils._assertInit(that);
    // Read from messages file
    const fileStr = await that.userSession
      .getFile(BlockStackUtils._genMessagesFileName(that), { 
        decrypt: false,
        username
      });
    const messages = JSON.parse(fileStr);
    // Add message
    messages.push({
      to, from, timestamp: Date.now(), body: messageBody, type: 'text'
    });
    // Write to messages file
    await that.userSession
      .putFile(BlockStackUtils._genMessagesFileName(that), JSON.stringify(messages), { 
        encrpyt: false,
        username
      });
    // Return updated messages
    return messages;
  }

  static checkMessagesPeriodically (that, onReceive) {
    
  }

  static async _demoLoadFriends (that) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return BlockStackUtils.demoFriends;
  }

  static async _demoLoadMessages (that) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return BlockStackUtils.demoMessages;
  }

  static demoFriends = [
    { name: 'moxiegirl.id.blockstack' },
    { name: 'okibeogezi.id.blockstack' },
    { name: 'ryanfields.id.blockstack' }
  ]

  static demoMessages = [
    { to: 'moxiegirl.id.blockstack', from: 'okibeogezi.id.blockstack', timestamp: Date.now(), body: 'Hey Moxie Girl!', type: 'text' },
    { to: 'okibeogezi.id.blockstack', from: 'moxiegirl.id.blockstack', timestamp: Date.now(), body: 'Hello Mikey!!', type: 'text' },
    { to: 'okibeogezi.id.blockstack', from: 'moxiegirl.id.blockstack', timestamp: Date.now(), body: 'How\'s It Going?', type: 'text' },
    { to: 'moxiegirl.id.blockstack', from: 'okibeogezi.id.blockstack', timestamp: Date.now(), body: 'Im Doing Excellent.', type: 'text' },
    { to: 'moxiegirl.id.blockstack', from: 'okibeogezi.id.blockstack', timestamp: Date.now(), body: 'You?', type: 'text' },
    { to: 'moxiegirl.id.blockstack', from: 'okibeogezi.id.blockstack', timestamp: Date.now(), body: 'Hey Moxie Girl!', type: 'text' },
    { to: 'okibeogezi.id.blockstack', from: 'moxiegirl.id.blockstack', timestamp: Date.now(), body: 'Hello Mikey!!', type: 'text' },
    { to: 'okibeogezi.id.blockstack', from: 'moxiegirl.id.blockstack', timestamp: Date.now(), body: 'How\'s It Going?', type: 'text' },
    { to: 'moxiegirl.id.blockstack', from: 'okibeogezi.id.blockstack', timestamp: Date.now(), body: 'Im Doing Excellent.', type: 'text' },
    { to: 'moxiegirl.id.blockstack', from: 'okibeogezi.id.blockstack', timestamp: Date.now(), body: 'You?', type: 'text' },
    { to: 'moxiegirl.id.blockstack', from: 'okibeogezi.id.blockstack', timestamp: Date.now(), body: 'Hey Moxie Girl!', type: 'text' },
    { to: 'okibeogezi.id.blockstack', from: 'moxiegirl.id.blockstack', timestamp: Date.now(), body: 'Hello Mikey!!', type: 'text' },
    { to: 'okibeogezi.id.blockstack', from: 'moxiegirl.id.blockstack', timestamp: Date.now(), body: 'How\'s It Going?', type: 'text' },
    { to: 'moxiegirl.id.blockstack', from: 'okibeogezi.id.blockstack', timestamp: Date.now(), body: 'Im Doing Excellent. Im Doing Excellent. Im Doing Excellent. Im Doing Excellent. Im Doing Excellent. Im Doing Excellent. Im Doing Excellent. Im Doing Excellent.', type: 'text' },
    { to: 'moxiegirl.id.blockstack', from: 'okibeogezi.id.blockstack', timestamp: Date.now(), body: 'You?', type: 'text' }
  ];
}