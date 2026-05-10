# CLAUDE.md

## Project overview

### What it does

This is a support tool for all members of a development team where they can practice the current domain knowledge using flash cards or multiple choice questions.

### What problem it solves

Projects usually have a bunch of domain specific or inhouse terms together with a set of technical solutions and projects. It's easy to forget parts of the project one isn't currently working on and it's sometimes hard to just "check up on things."

## Key features

- The main feature of this project is to show the user one "widget" at the time. Each widget will present some form of question to the user and provide some way of answeing it. After each answer the user will see if the answer is correct or not.
- The most basic test is a question with multiple answers.
- The user can access a personal page with different time period statistics.
- The user can mark the question as incorrect, and it will no longer be shown to any user.
- There is an interface to add new questions.
- There is an interface where a user can go through the invalidated questions and correct or remove them.

## Technology stack

- Nuxt
- Prisma
- Postgres
- Vitest
- Playwright
- Self hosted OpenId/OAuth2 user management.

## Architecture principles

## Coding conventions

## Rules

- Always ask before adding, removing or altering dependencies.
- Vitest should have 100% code coverage.
- Playwright should test all web related features (i.e. those available to the user).
- Migration scripts should be generated using Prisma and for all changes to the current models in the db using sequential migrations.
