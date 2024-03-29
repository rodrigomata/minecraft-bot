[![Production](https://github.com/rodrigomata/minecraft-bot/actions/workflows/production.yml/badge.svg?branch=main)](https://github.com/rodrigomata/minecraft-bot/actions/workflows/production.yml)

# Maincraft discord bot for noobs
This bot registers interesting locations in order to be able to search for them later.

## Stack
The bot is built on a AWS serverless application so it is simple and cost effective.

The different components of the architecture are AWS API Gateway + AWS Lambda + Algolia. We use Algolia as the datasource to be able to do fuzzy searchs. The lambda is built on Node.js v18 and in Typescript. We also leverage usage of the npm package.json hooks to update the different command interactions available on every deployment.

In order to keep a standardized codebase, there are rules added to automatically lint and format the code on commit.

## General Setup
1. Run `cp .env.sample .env`
2. Replace values depending on the action needed
3. Node.js v18.x required, then run `npm install`

### To update commands
4. Update the following values in `.env`:
```bash
DISCORD_BOT_TOKEN='sample-token'
DISCORD_BOT_CLIENT_ID='sample-id'
GUILD_ID='sample-id'
```
5. Once that's done, you can update the contents of `src/commands/interactions.json` and then run `npm register:commands``

### To update lambda interactions handler locally
4. Update the following values in `.env`:
```bash
DISCORD_BOT_PUBLIC_KEY='sample-key'
ALGOLIA_APP_ID='sample-id'
ALGOLIA_ADMIN_KEY='sample-key'
ALGOLIA_INDEX_NAME='sample-name'
```
5. Update your AWS credentials, I recommend updating the `~/.aws/credentials` and setting a profile there and then use this command `npm run deploy --aws-profile=<your-profile-name>`
**NOTE**: This is done with env variables automatically in the CI/CD pipeline

## Usage
Currently this bot should register new locations and be able to search through them:

### Registering a new location in Discord
Use `/register` command with the following format:
```bash
/register <x> <y> <z> <description>
# Example
/register 10 10 10 Horses
```

### Find a registered place
Use `/find` command with the following format:

```bash
/find <description>
# Example
/find Horses
```