```
<html>
   <head>
      <title>{{ page_title }}</title>
   </head>
   <body>
      Hello {{ name|lower:"asdsad" }}!
    </body>
</html>


//


import * as filters from filters;


interface Props {
    page_title: any;
    name: any;
}
    

const Page = ({page_title, name}: Props) => <html>
   <head>
      <title>{page_title}</title>
   </head>
   <body>
      Hello {lower(name)}!
    </body>
</html>
    


// File name : page.html
<html>
   <head>
      <title>{{ page_title }}</title>
   </head>
   <body>
      {% block content %}{% endblock %}
    </body>
</html>

// File name: hello.html
{% extends "page.html" %}

{% block content %}
Hello {{ name|lower:"asdsad" }}!
{% endblcok %}





const Page = ({title_block, content_block}: Props) => <html>
   <head>
      <title>{title_block}</title>
   </head>
   <body>
      {children}
    </body>
</html>


const Hello = ({page_title, name}) => <Page>Foo</Page>

/>



echo "interface Foo {" > output.ts
echo "page_title: string;" > output.ts


ast.createInterface(name, members: 
```
