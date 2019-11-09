module.exports = member => {
    let username = member.user.username;
    member.sendMessage('Sunucumuza Hoşgeldin ' + username + ' iyi eğlenceler');
};
