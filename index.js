export default {
  async email(message, env, ctx) {
    // List of email addresses that are allowed to receive emails
    // and the addresses to which the emails should be forwarded.
    //
    // The key is the recipient address and the value is an address
    // or an array of addresses to forward the message to.
    const forwardList = {
      "address@domain.tld": [
        "someone@to.forward.to",
        "somene-else@to.forward.to",
      ],
      "another-address@domain.tld": "somebody@to.forward.to",
    };

    // Extracts the email address without subaddressing,
    // e.g. address+something@domain.tld → address@domain.tld
    const extractAddress = (email) => {
      const [localPart, domain] = email.split("@");
      const cleanedLocalPart = localPart.split("+")[0];
      return `${cleanedLocalPart}@${domain}`;
    };

    // Checks if the email address is allowed
    const isAllowed = (email) => {
      const cleanedEmail = extractAddress(email);
      return Object.keys(forwardList).includes(cleanedEmail);
    };

    // Forwards the message to an address or multiple addresses
    const forward = async (addresses) => {
      const addressArray = Array.isArray(addresses) ? addresses : [addresses];
      for (const address of addressArray) {
        await message.forward(address);
      }
    };

    // Reject the message sent to an unknown address
    if (!isAllowed(message.to)) {
      message.setReject(`Address \`${message.to}\` doesn't exist`);
      return;
    }

    // Forward the message
    const addresses = forwardList[extractAddress(message.to)];
    await forward(addresses);
  },
};
