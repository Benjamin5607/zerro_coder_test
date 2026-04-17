# Zerro AI 5-Stage Project

### 🎯 사령관 지시사항
> 테트리스 게임 만들어줘

### 🏗️ Architecture
<think>
Okay, the user wants a Tetris game. Let me start by outlining the main components. First, the game area grid where the tetrominoes fall. Then, the tetromino shapes themselves, each with different colors and rotation states. Movement and rotation controls using keyboard inputs. Scoring system for cleared lines and increasing levels. A next piece preview to show the upcoming tetromino. Game over detection when the stack reaches the top. Maybe a pause/resume feature. Also, a high score tracker. Let me structure these into a component tree.

Wait, the user mentioned to avoid any introduction and just provide the component tree in text. So I need to list each component with their subcomponents. Let me make sure each part is covered. The game area grid, tetrominoes with their properties,

### 🛡️ QA Report
<think>
Okay, let's take a look at this React code. First, I need to check for rendering issues where the UI isn't properly rendered. The grid is created using a map over the grid state, but the structure might be off. The grid is a 20x10 array, but in the JSX, they're mapping grid.map((row, y) => ...) and then row.map(...). However, each row is an array of 10 elements, so the grid should be 20 rows of 10 columns. The JSX structure uses a grid-cols-10 for the outer div, which is correct. But ins