# Table of contents
* [About](#about)
* [Versions](#versions)
* [Initial idea](#initial-idea)
* [Wiki](#wiki)


# About
What have I learned?
* How to make big social website in **Vue - Javascript, SASS, HTML**
* Implementing subscription service with **Stripe**
* Using multiple dependencies such as Google Recaptcha, Chart.js
* Page deployment to **Google App Engine** on custom domain <br>

Learn more about the page on [tline.site](https://tline.site/about). Check out my [article](https://medium.com/@akuba_15181/digital-advertising-cb3d982a03d7) on advertising.

## Versions
Current version uses server side rendering and I didn't implemented developer environment. You can run production version by installing dependencies <code>npm install</code> and then <code>npm run start-w-build</code>. <br><br>

If you want to use prvious version without ssr but with development environment - hot reload etc go to <code>bae9b6d3a1650df180d978e6eeb4eecf11449ab1</code> [commit](https://github.com/adkuba/TL-frontend/tree/bae9b6d3a1650df180d978e6eeb4eecf11449ab1), install dependencies and run <code>npm run serve</code>

## Initial idea
A website that allows you to create your own portfolio, based on completed projects. <br>

Existing solutions:
- website builders such as WordPress - fully customizable websites
- timeline wizards - for making timelines e.g. for projects etc.
- job portals like linkedin

The main features of my site:
- based on one template for everyone - a timeline on which we add projects.
- at the events that we add to the timeline, there can be ONE additional timeline - these are details in a given project
- unification, what distinguishes user pages is only the content - our completed projects
- search by categories, e.g. IT, photos

Differentiators from existing solutions
- Page creators - I will have page unification - transparency
- Timeline wizards - I focus on a nice looking portfolio and projects, not fully customizable webpage
- Job advertisements - there are no job offers, only people present themselves in a clear way

Additional ideas:
- the ability to create a backup of the given pages?

## Wiki
I need to create frontend wiki, for more info look at Issues and read backend wiki on the other repository.
