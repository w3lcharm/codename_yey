module.exports = {
  langName: "en",

  cantUseCommandInDM: `> :x: You cannot use this command in DM.`,
  clickHere: "(click here)",
  daysAgo: days => `(${days} days ago)`,
  commandUsage: function (prefix, command) {
    let usages = command.usage;
    let str = `>>> Usage: `;
    if (usages instanceof Array) {
      usages = usages.map(u => `${prefix}${command.name} ${this[u]}`).join("\n");
      str += `\`\`\`\n${usages}\n\`\`\``
    }
    else str += `\`${prefix}${command.name} ${this[command.usage]}\``;

    return str;
  },
  botDontHavePerms: perm => `I don't have "${perm}" permission to do this.`,
  userIsOwner: "This user is a server owner.",
  roleHigher: "This user's role is higher than my role.",
  memberRoleHigher: "This user's role is higher than your role.",
  somethingWentWrong: "Something went wrong. Try again later.",
  dontHavePerms: ":x: You don't have permissions to use this command.",
  missingPermission: perm => `Missing permission: \`${perm}\``,
  errorInCommand: `:x: An unexpected error occurred while executing this command.`,
  errorDesc: "This error was sent to support server and will be fixed as soon as possible.",
  errorFooter: "You can also report this error to support server.",
  cooldown: left => `> :warning: You need to wait ${left} second(s) before using this command again.`,
  cantFindUser: "> :x: User not found.",
  botPrefix: prefix => `My prefix on this server is \`${prefix}\`.`,
  botPrefixFooter: prefix => `Use ${prefix}help to get a list of commands.`,
  antiInviteReason: "sent an invite link",

  permissions: {
    kickMembers: "Kick Members",
    banMembers: "Ban Members",
    manageRoles: "Manage Roles",
    manageMessages: "Manage Messages",
    manageGuild: "Manage Server",
  },

  status: {
    online: "<:online:737261991017840660> Online",
    idle: "<:idle:737262151718141963> Idle",
    dnd: "<:dnd:737262249378316360> Do not disturb",
    offline: "<:offline:737262088904507402> Offline",
  },

  general: "General",
  dev: "Dev",
  moderation: "Moderation",
  settings: "Settings",
  utility: "Utility",
  fun: "Fun",
  misc: "Misc",
  music: "Music",
  nsfwGroup: "NSFW",

  avatarDescription: "Gets your or someone's avatar.",
  avatarUsage: "[user: id, tag or mention]",
  avatarUsageServer: "server",
  avatarUsageBanner: "banner",
  avatarUsageSplash: "splash",
  avatarUser: user => `${user.tag}'s avatar:`,
  serverIcon: "Server icon:",
  avatarNoIcon: "> :x: This server does not have an icon.",
  serverBanner: "Server banner:",
  avatarNoBanner: "> :x: This server does not have a banner.",
  serverSplash: "Invite splash:",
  avatarNoSplash: "> :x: This server does not have an invite splash.",
  avatarURL: "Image URL",

  helpDescription: "Shows information about bot commands.",
  helpUsage: "[command]",
  helpCommandDoesntExist: cmd => `:x: Command \`${cmd}\` does not exist.`,
  helpCommandDoesntExistDesc: prefix => `Type \`${prefix}help\` to get a list of commands.`,
  helpCommandEmbedTitle: cmd => `Help for command \`${cmd}\`:`,
  helpCommandUsage: "Usage:",
  helpTitle: "Commands",
  helpTip: prefix => `There are all commands you can use.\nUse \`${prefix}help [command]\` to get a more info about an command.\nAny troubles? Feel free to join our support server.`,
  helpAliases: "Aliases:",
  helpLinkToSupportServer: "Link to support server",

  pingDescription: "Shows the bot latency.",
  pingMeasuring: "Measuring...",
  pingBotLatency: latency => `Bot latency is ${latency} ms.`,
  pingWebSocketLatency: latency => `WebSocket latency is ${latency} ms.`,

  serverDescription: "Shows info about server.",
  serverOwner: "Owner:",
  serverRegion: "Region:",
  serverMembers: "Members:",
  serverMembersTotal: "total",
  serverMembersBots: "bots",
  serverMembersOnline: "online",
  serverMembersIdle: "idle",
  serverMembersDND: "DND",
  serverMembersOffline: "offline",
  serverChannels: "Channels:",
  serverChannelsCategories: "categories",
  serverChannelsText: "text",
  serverChannelsVoice: "voice",
  serverTotalRoles: "Roles:",
  serverCreatedAt: "Created at:",
  serverVerificationLevel: "Verification level:",
  verificationLevel: [
    "None",
    "Low",
    "Medium",
    "High",
    "Very high",
  ],
  serverEmojis: "Emojis:",
  serverEmojisStatic: "static",
  serverEmojisAnimated: "animated",
  serverBoostLevel: "Boost level:",
  serverBoosts: "Boosts:",
  serverFeatures: "Features:",
  features: {
    INVITE_SPLASH: "Invite splash",
    VIP_REGIONS: "384 kbps bitrate",
    VANITY_URL: "Vanity URL",
    VERIFIED: "Verified",
    PARTNERED: "Discord Partner",
    COMMUNITY: "Community Server",
    COMMERCE: "Store Channels",
    NEWS: "News Channels",
    DISCOVERABLE: "In Server Discovery",
    FEATURABLE: "Featured in Server Discovery",
    ANIMATED_ICON: "Animated icon",
    BANNER: "Server banner",
    WELCOME_SCREEN_ENABLED: "Welcome Screen",
    MEMBER_VERIFICATION_GATE_ENABLED: "Membership Screening",
    PREVIEW_ENABLED: "Server preview",
  },

  statsDescription: "Shows the bot stats.",
  statsTitle: "Bot stats",
  statsUptime: "Uptime:",
  statsServers: "Servers:",
  statsUsers: "Users:",
  statsPlatform: "Platform:",
  statsVersions: "Versions:",
  statsRamUsed: "RAM usage:",
  statsBot: "bot",
  statsCpu: "CPU:",
  cantGetCpuInfo: "Unable to get CPU info",
  statsVoiceConnections: "Voice connections:",
  statsChannels: "Channels:",
  statsCommandsUsed: "Commands used:",

  userDescription: "Shows info about you or about provided user.",
  userUsage: "[user: id, tag or mention]",
  userStatus: "Status:",
  userRegisteredAt: "Registered at:",
  userJoinedAt: "Joined at:",
  userRoles: "Roles:",
  userBot: "Bot?",
  userBotDefine: bot => bot ? "Yes" : "No",
  userCustomStatus: "Custom status:",
  userWatching: "Watching:",
  userListening: "Listening to:",
  userStreaming: "Streaming:",
  userPlaying: "Playing:",
  userVoiceChannel: "Voice channel:",
  userJoinPosition: pos => `${pos}${pos % 10 == 1 ? "st" : pos % 10 == 2 ? "nd" : pos % 10 == 3 ? "rd" : "th"} member of this server.`,
  userNotInServer: "This user is not present on this server.",

  evalDescription: "Evaluates the JavaScript code.",
  evalUsage: "<code>",

  reloadDescription: "Reloads the command.",
  reloadUsage: "<command>",
  reloadCmdDoesntExist: command => `> :x: Command \`${command}\` doesn't exist.`,
  
  setgameDescription: "Sets the bot's playing/watching/listening status.",
  setgameUsage: "[-w, --watching] [-l, --listening] <text>",

  updateDescription: "Just git pull.",
  updateSuccess: ":white_check_mark: Successfully updated.",

  banDescription: "Bans the provided user.\nThis command requires the \"Ban members\" permission.",
  banUsage: "<user: mention, tag or id> [reason]",
  banSuccess: user => `${user.tag} has been banned`,
  reason: reason => `Reason: ${reason || "none"}`,
  cantBanYourself: `> :x: You can't ban yourself.`,
  cantBanBot: `> :x: You can't ban a bot.`,
  banFail: ":x: Ban failed.",

  hackbanDescription: "Hackbans the provided user.\nThis command requires the \"Ban members\" permission.",
  hackbanUsage: "<userID> [reason]",
  hackbanSuccess: user => `${user} has been hackbanned`,
  hackbanFail: ":x: Hackban failed.",
  hackbanUserNotFound: "> :x: This user ID does not exist.",
  hackbanUserAlreadyInServer: "> :x: This user is already a member of this server, use `ban` command instead.",
  
  kickDescription: "Kicks the provided user.\nThis command requires the \"Kick members\" permission.",
  kickUsage: "<user: mention, tag or id> [reason]",
  cantKickYourself: "> :x: You can't kick youself.",
  cantKickBot: "> :x: You can't kick a bot.",
  kickSuccess: user => `${user.tag} has been kicked`,
  kickFail: ":x: Kick failed.",

  muteDescription: "Mutes the provided user.\nAllowed time settings: Ns, Nm, Nh, Nd, where N is a number.\nThis command requires the \"Kick members\" permission.",
  muteUsage: "<user: mention, tag or id> [time] [reason]",
  cantMuteYourself: "> :x: You can't mute yourself.",
  cantMuteBot: "> :x: You can't mute a bot.",
  userAlreadyMuted: "> :x: This user is already muted.",
  muteSuccess: user => `${user.tag} has been muted`,
  canUnmuteSuggestion: prefix => `You can unmute the user by typing ${prefix}unmute <user: mention, tag or id>.`,
  muteFail: ":x: Mute failed.",
  muteTimeTooLong: "> :x: Mute time should not be more than 7 days.",

  purgeDescription: "Deletes the specified amount of messages.\nThis command requires the \"Manage messages\" permission.",
  purgeUsage: "<amount>",
  amountIsNaN: "> :x: Amount is not a number.",
  notLessThan1Msg: "> :x: Not less than 1 message.",
  notMoreThan100Msgs: "> :x: Not more than 100 messages.",
  purgeSuccess: amount => `:white_check_mark: Successfully deleted ${amount} messages.`,
  msgWillBeDeleted: "This message will be automatically deleted in 5 seconds.",
  purgeFailed: ":x: Purge failed.",

  unmuteDescription: "Unmutes the provided user.\nThis command requires the \"Kick members\" permission.",
  unmuteUsage: "<user: mention, tag or id>",
  userNotMuted: "> :x: This user is not muted.",
  unmuteSuccess: user => `${user.tag} has been unmuted`,
  unmuteFail: ":x: Unmute failed.",

  warnDescription: "Warns the provided user. Also lets you to show your or other user's warns or delete them (if you have \"Kick members\" permission).",
  warnUsage: "[-l, --list [user]] [-d, --delete <warnID>] <user: mention, tag or id> [reason]",
  totalWarns: number => `Total warns: ${number}`,
  invalidID: "> :x: Invalid warn ID.",
  warnOnAnotherServer: "> :x: This warn is located on another server.",
  warnDeleteSuccess: id => `> :white_check_mark: Deleted warn with ID ${id}`,
  cantWarnYourself: "> :x: You can't warn yourself.",
  cantWarnBot: "> :x: You can't warn a bot.",
  cantWarnAdmin: "> :x: You can't warn a member whose role higher than yours.",
  warnSuccess: user => `${user.tag} has been warned`,
  warnID: id => `Warn ID: ${id}`,
  warnsFooter: (total, maxPages, page) => `Total warns: ${total} | Page ${page} of ${maxPages}`,
  warnListFieldName: (id, user) => `ID: ${id} | warned by ${user.tag}`,
  warnIDNotProvided: "> :x: Warn ID not provided.",

  autoroleDescription: "Lets you to enable or disable the autorole.\nRequires \"Manage server\" permission.",
  autoroleUsage: "[role: id, name or mention | disable]",
  autorole: "Autorole",
  autoroleEnabled: role => `Autorole is enabled for role **${role}**.`,
  autoroleDisabled: "Autorole is disabled.",
  autoroleTip: prefix => `Use ${prefix}autorole [role: id, name or mention | disable] to change the autorole.`,
  autoroleDisableSuccess: "> :white_check_mark: Autorole has been disabled.",
  autoroleSuccess: role => `> :white_check_mark: Successfully set autorole to **"${role}"**.`,
  invalidRoleID: "> :x: Invalid role name or ID.",
  autoroleRoleHigher: "> :x: This role's position is higher or equals with my role.",

  modlogsDescription: "Lets you to manage the modlogs channel.\nRequires \"Manage server\" permission.",
  modlogsUsage: "[channel: mention or id]",
  modlogs: "Modlogs",
  modlogsEnabled: channel => `Modlogs are enabled in channel ${channel}.`,
  modlogsDisabled: "Modlogs are disabled.",
  modlogsTip: prefix => `Type ${prefix}modlogs [channel] if you want to enable or change the modlogs channel, or type ${prefix}modlogs disable to disable it.`,
  modlogsDisableSuccess: "> :white_check_mark: Modlogs have been disabled.",
  modlogsSuccess: channel => `> :white_check_mark: Successfully enabled modlogs in channel **\"${channel}\"**.`,
  invalidChannel: "> :x: Invalid channel provided.",
  modlogsDontHavePerms: ":x: I don't have permissions to send messages in this channel.",
  modlogsDontHavePermsDesc: "Please give me \"Send messages\" and \"Embed links\" permissions in this channel, then try again.",

  _8ballDescription: "A magic 8 ball.",
  _8ballUsage: "<question>",
  magicballAnswer: ":8ball: The magic ball's answer is:",
  yourQuestion: "Your question:",
  _8ballAnswers: {
    "true": [
      "It is certain",
      "Without a doubt",
      "Yes",
      "Yes - definitely",
      "It is decidedly so",
      "You may rely on it",
      "As I see it, yes",
      "Most likely",
      "Outlook good",
      "Signs point to yes",
    ],
    "false": [
      "Don't count on it",
      "No",
      "Outlook not so good",
      "Very doubtful",
      "My sources say no",
    ],
  },
  _8ballFailAnswers: [
    "Reply hazy, try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
  ],

  pollDescription: "Creates a reaction poll (up to 10 answers).\nIf -d or --delete key is specified, also tries to delete your message.\nYou can also use double quotes for question and answers.",
  pollUsage: "[-d, --delete] <question> <answers>",
  noAnswers: "> :warning: There must be at least 1 answer in the poll.",
  pollNotMoreThan10Answers: "> :x: Not more than 10 answers.",
  startedBy: user => `Started by ${user.tag}`,
  pollCantDeleteMessage: "> :warning: Couldn't delete message, please check bot permissions.",
  pollQuestionTooLong: "> :x: Question shouldn't be longer than 256 characters.",

  qrDescription: "Generates a QR code from your text.",
  qrUsage: "<text>",
  generationTime: time => `Took ${time} ms.`,

  udDescription: "Searches the word definition in Urban Dictionary.",
  udUsage: "<word>",
  wordNotFound: ":x: Word not found.",
  cantShowDefinition: ":x: I can't show this definition here.",
  linkToDefinition: link => `But there is a link to this definition: [(click here)](${link})`,
  example: "Example:",
  author: author => `Author: ${author}`,
  apiError: "> :x: API returned an unknown error.",

  languageDescription: "Changes the language.",
  languageUsage: "[language]",
  availableLanguages: "Available languages:",
  yourLanguage: "Your language:",
  languagesTip: prefix => `You can change the language by typing ${prefix}language [language]`,
  langDoesntExist: "> :x: This language doesn't exist.",
  langSuccess: name => `> :white_check_mark: Your language has been changed to \`${name}\`.`,

  randomDescription: "Generates a random number in specified range.\nIf one number specified, generates in range from 1 to number.\nIf two numbers specified, generates in range from smallest to biggest number.",
  randomUsageMax: "<max>",
  randomUsageMinMax: "<min> <max>",
  notANumber: "> :x: Not a number.",
  randomTitle: (min, max) => `Random number in range ${min}-${max}:`,

  xkcdDescription: "Gets a random xkcd comic.",

  roleDescription: "Shows info about provided role.",
  roleUsage: "<role: name or id>",
  roleNotFound: "> :x: Role not found.",
  roleColor: "Color:",
  roleMentionable: "Mentionable:",
  yesNo: what => what ? "Yes" : "No",
  roleDefaultColor: "Default",
  roleCreatedAt: "Created at:",
  roleMembers: "Members with this role:",
  roleHoisted: "Hoisted:",
  roleManaged: "Managed by integration:",

  supportDescription: "Sends the question to support server.\nYou may be prohibited from using this command for spam/flood/etc.",
  supportUsage: "<question>",
  supportBan: reason => `> :x: You are forbidden to use this command. Reason: ${reason || "none"}`,
  emptyQuestion: "> :warning: Question cannot be empty.",
  supportSuccess: "> :white_check_mark: Your question has been successfully sent to support server. Please wait for the answer, it usually takes from 5 to 10 minutes.",

  respondDescription: "Responds to question.",
  respondUsage: "<id> <answer>",
  respondInvalidID: "> :x: Invalid ID.",
  receivedAnswer: "Your question has been answered:",
  respondQuestion: "Your question:",
  
  remindmeDescription: "Sets a reminder.\nAllowed time settings: Ns, Nm, Nh, Nd, where N is a number.",
  remindmeUsage: "<time> <text>",
  remindmeInvalidTime: "> :x: Invalid time.",
  notMoreThan7Days: "> :warning: You can set a reminder for no more than 7 days.",
  textCantBeEmpty: "> :x: Text cannot be empty.",
  remindmeSuccess: "> :white_check_mark: Reminder has been successfully set.",
  reminder: "Reminder:",

  decodeqrDescription: "Decodes the QR code from image.",
  decodeqrUsage: "<image: url or attachment>",
  decodeqrInvalidURL: "> :x: Invalid URL. Maybe you specified the URL without a protocol?",
  decodeqrFail: "> :x: Unable to decode QR code from this image.",

  discriminatorDescription: "Shows up to 20 users who have provided discriminator.\nIf discriminator not provided, shows users who have the same discriminator with you.",
  discriminatorUsage: "[discriminator]",
  invalidDiscriminator: "> :x: You've provided invalid discriminator. Valid discriminators are in range from 0001 to 9999.",
  discriminatorEmbedTitle: discrim => `Users with #${discrim} discriminator:`,
  discriminatorNoUsersFound: "Currently I didn't seen any user who have this discriminator.",

  rextesterDescription: "Runs your Node.js code on Rextester.",
  rextesterUsage: "<code>",
  rextesterError: ":x: An error occurred while executing your code:",
  // rextesterErrorFooter: "Fix these errors, then try again.",
  rextesterCantShowResult: ":x: Result is too big to be shown in Discord.",
  rextesterSuccess: ":white_check_mark: Here is a result of your code:",
  rextesterEmptyResult: "Code returned empty result.",

  infoDescription: "Information about bot.",
  infoDesc: "A simple to use multipurpose bot written on JavaScript with Eris library.",
  infoDeveloper: "Developed by:",
  infoLinks: "Links:",
  infoBotInvite: "Invite me to your server",
  infoSupportServer: "Support server",
  infoDonate: "Donate",
  infoGitHubRepo: "GitHub repository",

  inviteDescription: "Shows information about invite.",
  inviteUsage: "<invite>",
  inviteInvalid: "> :x: Invite is invalid or expired.",
  inviteVerificationLevel: "Verification level:",
  inviteChannel: "Channel:",
  inviteMemberCount: "Member count:",
  inviteInviter: "Inviter:",
  inviteMemberCountDesc: (count, presences) => `${count} (${presences} online)`,

  embedDescription: "Sends an embed from JSON. You can use [this embed generator](https://leovoel.github.io/embed-visualizer/) or [Discohook](https://discohook.org) to generate the JSON embed.",
  embedUsage: "<json>",
  embedParseError: ":x: An error occurred while parsing your JSON data:",
  embedInvalid: "> :x: Embed should be an object.",

  prefixDescription: "Sets the new bot prefix.\nRequires the \"Manage server\" permission.",
  prefixUsage: "[prefix]",
  prefixDesc: prefix => `My prefix in this server is \`${prefix}\``,
  prefixFooter: prefix => `You can change the prefix by typing ${prefix}prefix [prefix]`,
  prefixCantBeLong: "> :x: Prefix cannot be longer than 10 characters.",
  prefixSuccess: prefix => `> :white_check_mark: Now my prefix in this server is \`${prefix}\``,

  joinmessageDescription: "Sets the message when new member joins the server.\n" + 
    "These keywords can be used in the message:\n" + 
    "`{mention}` - will be replaced with member mention\n" + 
    "`{tag}` - will be replaced with member tag\n" + 
    "`{server}` - will be replaced with server name\n" + 
    "`{memberCount}` - will be replaced with server member count\n" +
    "This command requires the \"Manage server\" permission.",
  joinmessageUsage: "[channel] [text]",
  joinmessageDisabled: "Join messages are disabled.",
  joinmessageEnabled: channel => `Join messages are enabled in channel ${channel}`,
  joinMessage: "Message:",
  joinmessageInvalidChannel: "> :x: Invalid channel.",
  joinmessageEmpty: "> :x: The text is empty.",
  joinMessageTooLong: "> :x: The text shound not be longer than 1536 characters.",
  joinmessageSuccess: channel => `> :white_check_mark: Successfully enabled join messages in channel ${channel}.`,
  joinmessageFooter: prefix => `You can enable join messages by typing ${prefix}joinmessage [channel] [text], to disable type ${prefix}joinmessage disable`,
  joinmessageDisableSuccess: "> :white_check_mark: Join messages have been successfully disabled.",

  leavemessageDescription: "Sets the message when member leaves the server.\nOther stuff is similar as in joinmessage command.",
  leavemessageDisabled: "Leave messages are disabled.",
  leavemessageEnabled: channel => `Leave messages are enabled in channel ${channel}`,
  leavemessageDisableSuccess: "> :white_check_mark: Leave messages have been successfully disabled.",
  leavemessageSuccess: channel => `> :white_check_mark: Successfully enabled leave messages in channel ${channel}.`,
  leavemessageFooter: prefix => `You can enable leave messages by typing ${prefix}leavemessage [channel] [text], to disable type ${prefix}leavemessage disable`,

  weatherDescription: "Gets the current weather in specified location.",
  weatherUsage: "<location>",
  locationNotFound: "> :x: Location not found.",
  weatherEmbedTitle: location => `Weather in ${location}:`,
  weatherTemperature: "Temperature:",
  weatherFeelsLike: "Feels like:",
  weatherHumidity: "Humidity:",
  weatherWind: "Wind:",

  blacklistDescription: "Blacklists the user.",
  blacklistUsage: "<user: mention, tag or id>",
  userNotBlacklisted: "> :x: This user isn't blacklisted.",
  userAlreadyBlacklisted: "> :x: This user is already blacklisted.",
  userNotFound: `> :x: User not found.`,

  base64Description: "Encodes your text to base64.\nYou can use -d or --decode flag to decode from base64.",
  base64Usage: "<text>",
  base64DecodeUsage: "-d <text> or --decode <text>",

  antiinviteDescription: "Lets you to manage the anti-invite.\nThe anti-invite will ignore the users who have the \"Manage Messages\" permission.",
  antiinviteUsage: "[action: delete, warn, kick, ban or disable]",
  antiinviteEnabled: action => `Anti-invite is enabled with the \`${action}\` action`,
  antiinviteDisabled: "Anti-invite is disabled.",
  antiinviteDisableSuccess: "> :white_check_mark: Anti-invite has been successfully disabled.",
  antiinviteInvalidAction: "> :x: You've provided an invalid action. The valid actions are delete, warn, kick, ban.",
  antiinviteEnableSuccess: action => `> :white_check_mark: Anti-invite has been successfully enabled with \`${action}\` action.`,
  antiinviteFooter: prefix => `You can enable the anti-invite by typing ${prefix}antiinvite [action: delete, warn, kick, ban or disable].`,

  githubDescription: "Searches and shows information about GitHub repository.",
  githubUsage: "<repo>",
  githubRepoNotFound: "> :x: Repository not found.",
  githubWatchers: "Watchers:",
  githubStars: "Stars:",
  githubForks: "Forks:",
  githubLicense: "License:",
  githubLanguage: "Language:",
  githubRepoCreatedAt: "Created at:",

  unbanDescription: "Unbans the specified user.\nRequires `Ban Members` permission.",
  unbanUsage: "userID",
  unbanSuccess: user => `${user} has been unbanned`,
  unbanInvalidUser: `Invalid user ID or this user hasn't been banned.`,
  unbanFail: ":x: Unban failed.",

  playDescription: "Plays a track in voice channel.",
  playUsage: "<track: name or url>",
  playNotInVoiceChannel: "> :x: You are not in voice channel or not in the same channel with me.",
  playAddedToQueue: track => `> Added to queue: \`${track}\``,
  nowPlaying: ":arrow_forward: Now playing:",
  playAuthor: author => `Uploaded by: ${author}`,
  allTracksPlayed: "> :stop_button: All tracks have been played.",
  playlistsNotSupported: "> :x: Playlists are not supported currently.",
  trackNotFound: "> :x: Track not found.",
  trackLoadFailed: msg => `> :x: Failed to load the track. \`${msg}\``,
  duration: "Duration:",
  playFailed: ":x: Failed to play the track.",
  playFailedDesc: "This track is age-restricted, blocked or has limited access.",

  pauseDescription: "Pauses the track.",
  notPlaying: "> Nothing is playing now.",
  alreadyPaused: "> :pause_button: Track is already paused.",
  paused: prefix => `> :pause_button: Paused. Type \`${prefix}resume\` to resume.`,

  resumeDescription: "Resumes the track.",
  alreadyPlaying: "> :arrow_forward: Already playing the track.",
  resumed: "> :arrow_forward: Resumed.",

  stopDescription: "Stops the track and clears the queue.",

  nowplayingDescription: "Shows the currently playing track.",

  skipDescription: "Skips the track.",
  skipping: "> :fast_forward: Skipping...",

  queueDescription: "Shows the track queue.",
  trackQueue: "Track queue:",
  durationRequestedBy: (duration, user) => `Duration: ${duration} | Requested by ${user}`,
  queueIsEmpty: "> Queue is empty.",
  queueFooter: (page, max) => `Page ${page} of ${max}`,

  embedcolorDescription: "Lets you to change the embed color.",
  embedcolorUsage: "[#hex or number | random | default]",
  embedcolorRandom: "Your embed color is `random`.",
  embedcolorDefault: "Your embed color is `default`.",
  embedColor: color => `Your embed color is \`${color}\`.`,
  embedcolorFooter: prefix => `Use ${prefix}embedcolor [#hex or number | random | default] if you want to change the embed color.`,
  embedcolorDefaultSuccess: "> :white_check_mark: Your embed color is set to `default`.",
  embedcolorRandomSuccess: "> :white_check_mark: Your embed color is set to `random`.",
  invalidColor: "> :x: Invalid color number.",
  embedcolorSuccess: color => `> :white_check_mark: Your embed color is set to \`${color}\``,

  loopDescription: "Toggles looping for the currently playing track.",
  loopEnabled: "> Loop enabled.",
  loopDisabled: "> Loop disabled.",

  npmDescription: "Searches the package in NPM.",
  npmUsage: "<package>",
  npmNoPkg: "> :x: No query provided.",
  npmPkgNotFound: "> :x: Package not found.",
  npmVersion: "Version:",
  npmLicense: "License:",
  npmKeywords: "Keywords:",
  npmModifiedAt: "Modified at:",

  volumeDescription: "Sets the music volume.",
  volumeUsage: "[newVolume]",
  currentVol: vol => `Current volume is ${vol}%.`,
  volumeTip: prefix => `Use ${prefix}volume [newVolume] to set the new volume.`,
  volumeInvalid: "> :x: Volume should be in range 1-100.",
  volumeChanged: vol => `> :speaker: Volume has been set to ${vol}%.`,

  wikipediaDescription: "Searches the page in Wikipedia.",
  wikipediaUsage: "<query>",
  wikipediaNoQuery: "> :x: No query provided.",
  wikipediaNotFound: "> :x: Page not found.",
  wikipediaDisambiguation: "> :x: The page you are looking for is disambiguation page.",
  wikipediaLinkToPage: "Link to page",

  emojiDescription: "Enlarges the provided emoji.\nStandard Discord emojis are not supported.",
  emojiUsage: "<emoji>",
  noEmoji: "> :x: Please provide the correct emoji.",
  invalidEmoji: "> :x: Invalid emoji provided.",
  emojiID: id => `ID: ${id}`,
  emojiURL: "Emoji URL",

  queueloopDescription: "Toggles looping for the music queue.",
  queueloopEnabled: "> Queue loop enabled.",
  queueloopDisabled: "> Queue loop disabled.",

  rule34Description: "Gets random post from rule34.xxx by provided tag.\nThis command can only be used in channels marked as NSFW.",
  rule34Usage: "<tag>",
  notNsfwChannel: "> :x: You can use this command only in channels marked as NSFW.",
  noPostsFound: tag => `> :x: No posts found by tag \`${tag}\`.`,
  rule34Video: (url, tags) => `> Link to video: ${url}\n> Tags: ${tags}`,
  rule34Post: "Post",
  score: "Score:",
  tags: "Tags:",
  postURL: "Post URL",
  usedBy: tag => `Used by ${tag}`,

  reactionroleDescription: "Lets you to manage reaction roles.\nRequires \"Manage Guild\" permission.\nAlso keep in mind that you should use this command in the same channel where you want to setup the reaction role.",
  reactionroleUsage: "<messageID> <emoji> <role | disable to disable this reaction role>",
  reactionRoles: "Reaction roles on this message:",
  tooMoreReactionRoles: "> :x: There is more than 20 reaction roles on this message.",
  noRoleProvided: "> :x: No role provided.",
  reactionRoleDoesNotExist: "> :x: This reaction role does not exist.",
  reactionRoleDeleteSuccess: "> :white_check_mark: Reaction role successfully removed.",
  invalidRoleProvided: "> :x: This role does not exist.",
  providedRoleHigher: "> :x: This role is higher than my role.",
  reactionRoleDontHavePerms: "> :x: I don't have the `Manage Roles` permission to do this.",
  reactionRoleSuccess: "> :white_check_mark: Reaction role successfully created.",
  invalidMessage: "> :x: Invalid message ID provided.",

  hentaiDescription: "Gets random hentai image or gif.\nThis command can only be used in channels marked as NSFW.",
  hentaiRatelimit: "> :x: Too many requests are made in short period of time. Try again later.",

  pussyDescription: `Gets a random pussy image.\nThis command can only be used in channels marked as NSFW.`,

  soloDescription: `Gets a random solo porn image.\nThis command can only be used in channels marked as NSFW.`,

  boobsDescription: `Gets a random boobs image.\nThis command can only be used in channels marked as NSFW.`,
};