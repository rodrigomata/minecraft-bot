# Maincraft discord bot for noobs
This bot registers interesting locations in order to be able to search for them later.

## Setup
`cp .env.sample .env` and update envs

## Registering a new location in Discord
Use `/register` command with the following format:
```bash
/register <x> <z> <description>
# Example
/register 10 10 Horses
```

## Find a registered place
Use `/find` command with the following format:

```bash
/find <description>
# Example
/find Horses
```