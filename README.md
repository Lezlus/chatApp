# Real Time Chatapp

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href='#about-the-project'>About The Project</a>
      <ul>
        <li><a href='#built-with'>Built With</a></li>
        <li><a href='#features'>Features</a></li>
      </ul>
    </li>
    <li><a href='#contact'>Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
My second project with React. I've adhered to good practices and tried to follow DRY.
DjangoREST is used with Django channels which works with the websocket. Redis is used as a backing store for Django channels. At the time Redis was unsupported for windows, I used docker to spin up a Redis server.

## Built With
* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray)
* ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
* ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
<!-- FEATURES -->
## Features
<ol>
  <li>
    Users
    <ul>
      <li>Login/Logout</li>
      <li>When a user logs in a 'user active' icon lights up</li>
      <li>Chat history is stored</li>
    </ul>
  </li>
</ol>
