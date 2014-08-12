# nsyrc
## A command line tool for easily defining and maintaining rsync backups
nsyrc lets you save links between source and target folders, and rsync easily between them.

* * *
### Installation
```bash
$ npm install -g nsyrc
```
* * *
### Usage

`nsyrc` shows you the list of your defined links.
Here is the result of running `nsyrc` with [this .nsyrc file](https://github.com/danyshaanan/nsyrc/blob/master/doc/dot.nsyrc_example):

![Screen shot of a result of `nsyrc show`](https://raw.github.com/danyshaanan/nsyrc/master/doc/nsyrc_example.png?raw=true)

Each row represents a link. The padded columns are, from left to right:

* id - used for syncing or removing links.
* Source folder, Target folder, which are marked with these colors:
 * Green: local existing folder
 * Yellow: remote folders, which are not checked for existance
 * Gray: local non-existing folders, probably folders on removeable media
* How long ago it was last synced, which is marked with these colors that represent predefined periods of time:
 * White: less than a day
 * Yellow: more than a day and less than a week
 * Red: more than a week

A pending feature will enable the user to set those period of time.


`nsyrc -l <source> <target>` creates a new link.

`nsyrc <id>` prompts the user to run the link with --dry-run first, and then without. Use `--wet` to skip dry-run.

`nsyrc -n` does the same for the first link that was not synced in the last 24 hours.

`nsyrc -t <id>` trashes a link. `nsyrc -e` empties the trash. The trash is currently only accessible through opening ~/.nsyrc


* * *
### Info
* The links data is saved as json in ~/.nsyrc
* The default for the dry-run prompt is YES, while the default of the wet-run prompt is NO.
* Common use is for syncing folders, but defining links between files is also possible.

* * *
### Disclaimer

While nsyrc tries to distance the user from the dangers of using rsync directly, it is still a program that runs rsync commands, and that was written by a human being, and no one can guarantee that it is devoid of bugs or unexpected behaviors, therefore use this software at your own risk.

* * *
### Feedback
* If you enjoyed this tool, please star it on Github!
* I'd love to get any feedback you might have! Mail me at danyshaanan@gmail.com, or [open an issue](https://github.com/danyshaanan/nsyrc/issues/new).
* More material appreciation is welcome in the form of bitcoins. My address can be found on [this page](http://danyshaanan.com/bitcoin).
