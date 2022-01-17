const client = global.client;
module.exports = () => {
  console.log("Bot başarıyla aktif oldu!");
  client.user.setActivity("Kapsent & Eresbos Sekme Koruması");
}
module.exports.configuration = {
  name: "ready"
}