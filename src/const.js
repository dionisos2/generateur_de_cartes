/**
   The prefix to put in the ID of a svg rectangle, to define the limit of a text.
   ex:
```svg
<rect
    id="TEXTBOXtitleBOX"
    width="200"
    height="200"
    x="100"
    y="100">
</rect>
<text
    style="font-size:20px"
    id="whatever">
    title
</text>
```
*/
export const TEXTPREFIX = 'TEXTBOX'

/**
   The suffix for whatever kind of box, see {@link TEXTPREFIX}
*/
export const BOXPOSTFIX = 'BOX'

/**
   The name the head of the column (of the CSV table) should have to specify the svg template of the cards.
   In the CSV table, the svg template of a card should be given by the name of the svg template file.
   ex:
```
   |template_name|
   |template1.svg|
   |template1.svg|
   |template2.svg|
```
*/
export const TEMPLATEHEADERNAME = 'template_name'
