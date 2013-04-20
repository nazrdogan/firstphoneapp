var _status_message = new Array();
var _alert_message_list = new Array();
var _client_labels = new Array();
var _toolbar_title_labels = new Array();
var _word_list = new Array();
var _server_error_codes = new Array();


// **********************************************  English  **********************************************

var newRegisterURL = new Array();
var forgotPasswordURL = new Array();
newRegisterURL['aim'] = "https://reg.my.screenname.aol.com/_cqr/registration/initRegistration.psp";
newRegisterURL['jab'] = "https://www.google.com/accounts/NewAccount";
newRegisterURL['msn'] = "https://accountservices.passport.net/reg.srf?roid=2&sl=1&vv=600&lc=2057";
newRegisterURL['yah'] = "https://edit.yahoo.com/registration?";
forgotPasswordURL['aim'] = "https://account.login.aol.com/opr/_cqr/opr/opr.psp";
forgotPasswordURL['jab'] = "https://www.google.com/accounts/ForgotPasswd?service=mail&fpOnly=1";
forgotPasswordURL['msn'] = "https://account.live.com/ResetPassword.aspx";
forgotPasswordURL['yah'] = "https://edit.yahoo.com/forgot?stage=c1a&src=ym&intl=us&done=http://mail.yahoo.com&partner=";

_status_message['english'] = [["I am online", "1", "available"], //["I'm offline", "0"],
["Busy", "2", "busy"], 
//["Be right back", "3", "busy"], 
["Away", "4", "away"],
//["Idle", "5"],
//["On phone", "6", "busy"], ["Out for lunch", "7"],
//["Vacation", "8"],
//["Not at home", "9"],
//["Not at office", "10"],
//["Not at desk", "11", "busy"], ["Stepped out", "12", "busy"], ["I am invisible", "13", "invisible"], 
["Custom message", "14", "available"], ];


_server_error_codes['english'] = ["Connect failed.", "Login failed.", "Cannot Process the Request", "Message delivery failure.", "Invalid request (invalid XML).", "Already logged into this service.", "Logged in from some other location.", "Connection Closed by Server", "Long Group names not allowed in MSN", "Rate Limit Hit", "Rate Limit Restored", "File transfer failed", "Recipent offline", "File transfer not supported", "File sent Successfully", "File transfer declined", "File transfer failed"];

_alert_message_list['english'] = new Array();
_alert_message_list['english'][1] = ["Send referral", "Referrals sent."];
_alert_message_list['english'][2] = ["Add buddy", "Please provide complete details."];
_alert_message_list['english'][3] = ["Add buddy", "Invalid screen name."];
_alert_message_list['english'][4] = ["Add buddy", "This buddy is already part of your list."];
_alert_message_list['english'][5] = ["Login", "Invalid username."];
_alert_message_list['english'][6] = ["Login", "Invalid password."];
_alert_message_list['english'][7] = ["Login", "Invalid username. (MSN)"];
_alert_message_list['english'][8] = ["Login", "Invalid username. (AIM)"];
_alert_message_list['english'][9] = ["Login", "Invalid password. (AIM)"];
_alert_message_list['english'][10] = ["Login", "Invalid username. (Yahoo)"];
_alert_message_list['english'][11] = ["Login", "Please provide name@server"];
_alert_message_list['english'][12] = ["Login", "Please provide correct username and password."];
_alert_message_list['english'][13] = ["popout1", "Popout", "Complete add buddy task to popout."];
_alert_message_list['english'][14] = ["Add buddy", "%%% has denied your request."];
_alert_message_list['english'][15] = ["popout1", "Add Addressbook", "Address book is being extracted, \nPlease wait for some time"];
_alert_message_list['english'][16] = ["Error", "Operation on Buddy List Failed.This may be due to invalid ID,\nID already present or some unknown reason."];
_alert_message_list['english'][17] = ["popout2", "Sending Referrals", "Busy sending email referral.Wait for some\n time and try again."];
_alert_message_list['english'][18] = ["addrequet", "Add request pending ", "You have a friend request."];
_alert_message_list['english'][19] = ["Invalid Password", "Please provide password for %%%"];
_alert_message_list['english'][20] = ["Block Buddy", "Do you want to block %%% ?"];
_alert_message_list['english'][21] = ["Remove Buddy", "Do you want to remove %%% ?"];
_alert_message_list['english'][22] = ["Unblock Buddy", "Do you want to unblock %%% ?"];
_alert_message_list['english'][23] = ["Logout", "Logout in Progress"];
_alert_message_list['english'][24] = ["Block Buddy", "Buddy won't be unblocked if you cancel this operation.\nClick OK to continue anyway else click Cancel."];
_alert_message_list['english'][25] = ["Login", "Login in Progress"];
_alert_message_list['english'][26] = ["Add Buddy", "%%% wants to add you in your buddy list"];
_alert_message_list['english'][27] = ["Conference Invitation", "You have been invited to a conference session by <b>%%%</b>.\n\n<b>Message:</b> ***"];
_alert_message_list['english'][28] = ["File Transfer", "Username '%%%' wants to send you file '###'.\n Do you want to accept the file?"];
_alert_message_list['english'][29] = ["Login", "Please first login to any of the services"];

_client_labels['english'] = new Array();
_client_labels['english'][0] = "Deny";
_client_labels['english'][1] = "Invalid Request";
_client_labels['english'][2] = "Add Request";
_client_labels['english'][3] = "Online";
_client_labels['english'][4] = "Login";
_client_labels['english'][5] = "Applications";
_client_labels['english'][6] = "IM";
_client_labels['english'][7] = "Block";
_client_labels['english'][8] = "Remove";
_client_labels['english'][9] = "Unblock";
_client_labels['english'][10] = "Messenger";
_client_labels['english'][11] = "New User";
_client_labels['english'][12] = "Forgot Password";
_client_labels['english'][13] = "Logout";
_client_labels['english'][14] = "Screen Name";
_client_labels['english'][15] = "Group";
_client_labels['english'][16] = "Cancel";
_client_labels['english'][17] = "Add";
_client_labels['english'][18] = "Hi there";
_client_labels['english'][19] = "Approve";
_client_labels['english'][20] = "Username";
_client_labels['english'][21] = "Password";
_client_labels['english'][22] = "Remember Me";
_client_labels['english'][23] = "Sign In";
_client_labels['english'][24] = "Buddies";
_client_labels['english'][25] = "Clear Search";
_client_labels['english'][26] = "Show Offline Buddies";
_client_labels['english'][27] = "Status";
_client_labels['english'][28] = "Show Chat History";
_client_labels['english'][29] = " Message from %%% ";
_client_labels['english'][30] = "Notifications";
_client_labels['english'][31] = "Start typing to search buddies...";
_client_labels['english'][32] = "Error";
_client_labels['english'][33] = "Invite";
_client_labels['english'][34] = "Save";
_client_labels['english'][35] = "I'm on munduIM from Palm Pre";
_client_labels['english'][36] = "Remove all accounts";

_toolbar_title_labels['english'] = new Array();
_toolbar_title_labels['english'][0] = "Bold";
_toolbar_title_labels['english'][1] = "Underline";
_toolbar_title_labels['english'][2] = "Select smiley";
_toolbar_title_labels['english'][3] = "Select text color";
_toolbar_title_labels['english'][4] = "Buzz";

_word_list['english'] = new Array();
_word_list['english']['Is'] = "Is"; //  auxilary verb used to show status of buddy in the chat window status bar Eg: "buddy is online".
_word_list['english']['offline'] = "offline";
_word_list['english']['online'] = "online";
_word_list['english']['busy'] = "busy";
_word_list['english']['away'] = "away";
