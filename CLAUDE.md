# CLAUDE.md

## Project overview

### What it does

This is a support tool for all members of a development team where they can practice the current domain knowledge using flash cards or multiple choice questions.

### What problem it solves

Projects usually have a bunch of domain specific or inhouse terms together with a set of technical solutions and projects. It's easy to forget parts of the project one isn't currently working on and it's sometimes hard to just "check up on things."

## Key features

- The main feature of this project is to show the user one "widget" at the time. Each widget will present some form of question to the user and provide some way of answering it. After each answer the user will see if the answer is correct or not.
- The most basic test is a question with multiple choices. When the user answers incorrectly, the correct answer must be clearly shown.
- There is a study mode where the user can go through all questions sequentially. Current progress (question X of N) and a running tally of correct vs incorrect answers are shown throughout, and a summary screen is displayed on completion.
- The user can access a personal statistics page with breakdowns for today, this week, this month, and all time.
- The user can reset all of their personal progress (attempt history) from the statistics page.
- The user can mark a question as flagged/incorrect, and it will no longer be shown to any user in the quiz or study mode.
- There is a browsable list of all unflagged questions where each question can be edited inline or flagged.
- There is an interface where a user can go through the flagged questions and correct or permanently remove them.
- There is an interface to add new questions.
- There is a left-side expandable navigation menu that lets the user move between all pages in the application.
- The user can log out from the navigation sidebar.

## Technology stack

- Nuxt
- Prisma
- Postgres via a docker container.
- Vitest
- Playwright
- Self hosted OpenId/OAuth2 user management.

## Architecture principles

## Coding conventions

## Rules

- Always work via pull requests. Never push directly to the main branch.
- Always ask before adding, removing or altering dependencies.
- Vitest should have 100% code coverage.
- Playwright should test all web related features (i.e. those available to the user).
- Migration scripts should be generated using Prisma and for all changes to the current models in the db using sequential migrations.
