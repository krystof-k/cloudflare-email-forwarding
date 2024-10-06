# Free email forwarding via Cloudflare

[Cloudflare](https://www.cloudflare.com) offers a free solution for setting up advanced email forwarding using [Cloudflare Email Routing](https://www.cloudflare.com/developer-platform/email-routing/) and [Cloudflare Workers](https://www.cloudflare.com/developer-platform/workers/). This repository provides a boilerplate for the worker and a quick guide on how to set it up.

> [!TIP]
> **Simplify your life!** Instead of using Cloudflare, consider the beautiful [ImprovMX](https://improvmx.com) service. It offers similar functionality in a much easier way, and it's free if you need just one domain. Definitely worth the money if you need more features!

## Setup

### Step-by-step guide

1.  **Create your own repository**  
    Click _Use this template_ at the top right corner and create your own repository, either public or private.

2.  **Sign up for Cloudflare and add your domain**  
    If you don’t already have a Cloudflare account, [sign up](https://dash.cloudflare.com/sign-up) and add your domain. Be aware that you will need to migrate your DNS records, which may take some time.

3.  **Create the email forwarding worker**  
    In Cloudflare, go to _Workers & Pages_, click _Create_, then _Create Worker_. Name it something like `email-forwarding` and click _Deploy_. You don’t need to modify the code at this point. Click _Continue to the project_.

4.  **Connect your worker to the repository**  
    Navigate to _Settings_, scroll to the _Build_ section, and click _Connect_ in the _Git repository_ box. Authorize your GitHub account, select the repository (e.g. `email-forwarding`), and click _Connect_.

5.  **Setup forwarding and destination addresses**  
    Configure the forwarding and destination email addresses (see [below](#configuring-addresses)) in your repository.

6.  **Set up email routing for your domain**  
    Go to your domain, click _Email_, then _Email Routing_, and _Get Started_. Afterward, click _Skip getting started_, enable _Email Routing_, and click _Add records and enable_.

    Then, go to the _Routing Rules_ tab. Next to the catch-all address, click _Edit_, choose _Send to a Worker_ as the action, and select your `email-forwarding` worker. Save and enable the rule.

    In case you have multiple domains, just repeat this step for each: you can use a single worker for multiple domains.

    You will also need to verify the destination addresses in Cloudflare: go back to your domain, open the _Destination Address_ tab, add the email addresses you want to forward to, and click the verification link in the email sent by Cloudflare.

7.  **Test it out**  
    You're all set! 🚀 Send a test email to the address you just set up and check that it gets forwarded correctly.

If you have any troubles or feedback, feel free to [create an issue](https://github.com/krystof-k/cloudflare-email-forwarding/issues).

### Configuring addresses

To adjust incoming and forwarding email addresses, edit the `forwardList` constant in the [worker script](./index.js):

```javascript
const forwardList = {
  "address@domain.tld": [
    "recipient1@forward.to",
    "recipient2@forward.to",
  ],
  "another-address@domain.tld": "recipient@forward.to",
};
```

The key represents the recipient email address on your domain, and the value is either a single email address or an array of addresses where messages should be forwarded.

You can also use subaddressing aka the plus sign trick. For example, emails sent to _address+something@domain.tld_ will still be delivered as if sent to _address@domain.tld_.
