let toanky_invites = {};

async function on(client) {
    client.on('ready', async () => {
        setTimeout(() => {
            client.guilds.cache.forEach(g => {
                g.invites.fetch().then(guildInvites => {
                    toanky_invites[g.id] = guildInvites;
                });
            });
        }, 2000)
    });
    client.on('guildMemberAdd', user => {
        try {
            user.guild.invites.fetch().then(async guildInvites => {
                const ei = toanky_invites[user.guild.id];
                toanky_invites[user.guild.id] = guildInvites;
                if (!ei) return;
                await user.guild.invites.fetch().catch(() => undefined);
                const invite = guildInvites.find(i => {
                    const a = ei.get(i.code);
                    if (!a) return;
                    return a
                });
                if (!invite) return;
                const inviter = client.users.cache.get(invite.inviter.id);
                client.emit("inviteJoin", user, invite, inviter)
            });
        } catch (e) {}
    });
}

exports.on = on;