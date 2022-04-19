import chalk from "chalk";
import clear from "clear";
import inquirer from "inquirer";
import fs from "fs";

clear();

function createList(listName) {
  if (!fs.existsSync("./lists")) fs.mkdirSync("./lists");
  if (!listName) console.log(chalk.red("Please enter a list name"));
  else fs.writeFileSync(`./lists/${listName}.json`, "");
}

function getLists() {
  if (fs.existsSync("./lists")) {
    return fs.readdirSync("./lists");
  }
  return [];
}

function app() {
  const lists = getLists();
  if (lists.length === 0) {
    inquirer
      .prompt([
        {
          type: "boolean",
          name: "listConfirmation",
          message: "You dont have any lists. Do you want to create one? [Y/N]",
        },
      ])
      .then((answers) => {
        if (answers.listConfirmation == "Y") {
          inquirer
            .prompt([
              {
                type: "input",
                name: "listName",
                message: "What is the name of your list?",
              },
            ])
            .then((answers) => {
              createList(answers.listName);
              console.log(chalk.green(`List [${answers.listName}] created!`));
            });
        } else if (answers.listConfirmation == "N") {
          console.log(chalk.bold("👋 Goodbye!"));
        } else {
          console.log(chalk.bold("🔴 Wrong Option!"));
        }
      });
  } else {
    inquirer
      .prompt([
        {
          type: "list",
          name: "listName",
          message: "Which list do you want to use?",
          choices: lists,
        },
      ])
      .then((answers) => {
        console.log(chalk.green(`List [${answers.listName}] selected!`));
        const list = require(`./lists/${answers.listName}`);
        /*
        {
          "buyMilk": true,
        }
        */
        inquirer
          .prompt([
            {
              type: "list",
              name: "action",
              message: "What do you want to do?",
              choices: [
                {
                  name: "Add item",
                  value: "add",
                },
                {
                  name: "Remove item",
                  value: "remove",
                },
                {
                  name: "Check item",
                  value: "check",
                },
                {
                  name: "Exit",
                  value: "exit",
                },
              ],
            },
          ])
          .then((answers) => {
            switch (answers.action) {
              case "add":
                inquirer
                  .prompt([
                    {
                      type: "input",
                      name: "item",
                      message: "What is the name of the item?",
                    },
                  ])
                  .then((answers) => {
                    list[answers.item] = false;
                    fs.writeFileSync(
                      `./lists/${answers.listName}.json`,
                      JSON.stringify(list)
                    );
                    console.log(chalk.green(`Item [${answers.item}] added!`));
                  });
                break;
              case "remove":
                inquirer
                  .prompt([
                    {
                      type: "input",
                      name: "item",
                      message: "What is the name of the item?",
                    },
                  ])
                  .then((answers) => {
                    delete list[answers.item];
                    fs.writeFileSync(
                      `./lists/${answers.listName}.json`,
                      JSON.stringify(list)
                    );
                    console.log(chalk.green(`Item [${answers.item}] removed!`));
                  });
                break;
              case "check":
                inquirer
                  .prompt([
                    {
                      type: "input",
                      name: "item",
                      message: "What is the name of the item?",
                    },
                  ])
                  .then((answers) => {
                    if (list[answers.item]) {
                      console.log(
                        chalk.green(`Item [${answers.item}] checked!`)
                      );
                    } else {
                      console.log(
                        chalk.red(`Item [${answers.item}] not found!`)
                      );
                    }
                  });
                break;
              case "exit":
                console.log(chalk.bold("👋 Goodbye!"));
                break;
              default:
                console.log(chalk.bold("🔴 Wrong Option!"));
            }
          });
      });
  }
}

app();
