# VE Customizations
This repository contains Primo VE customizations that are not part of the [Alliance Central Package](https://github.com/alliance-pcsg/ve-central-package).
You may copy from these files into the custom.js of a local package and modify as needed to work for your institution.

## [Add Buffer to Advanced Search Terms](https://github.com/alliance-pcsg/ve-customizations/blob/main/buffer-advanced-search.js)
This customization adds a buffer to the beginning of the search terms displayed under the collapsed Advanced Search form,
to prevent the field from being destroyed when a patron uses the backspace. See the
[video demonstration](https://drive.google.com/file/d/1vOjbQEVVf4seOzoFh90OQBQqdpdXaC0C/view?usp=sharing).

## [Move Focus to Action on Hover](https://github.com/alliance-pcsg/ve-customizations/blob/main/focus-action-on-hover.js)
The intended behavior of Primo VE is to retain focus on the first action in a list only, even when users mouse over other actions. This customization moves focus to other actions on hover.

## [Show MMS IDs](https://github.com/alliance-pcsg/ve-customizations/blob/main/show-mmsids.js)
This customization will display Institution Zone and Network Zone MMS IDs, if available, at the end of the metadata list in a full display record. In addition to inserting the code in and institution's custom.js file and adding `showMmsid` to `var app=angular.module...`, implementers should add custom values to the `showMmsidOptions` section:

```
/* Custom options for labels, institution-specific trailing 4-digits for IZ MMS ID, and institution code  */
app.constant('showMmsidOptions', {
  "izLabel": "MMS ID (IZ)", /* Field value for Institution Zone MMS ID */
  "nzLabel": "MMS ID (NZ)", /* Field value for Network Zone MMS ID */
  "izSuffix": "xxxx", /* institution-specific trailing 4 digits*/
  "instCode":"01ALLIANCE_XXX" /* institution code, e.g. 01ALLIANCE_LCC*/
});
```
Please see [this document](https://docs.google.com/spreadsheets/d/1Wyab3UPyUm34Ak9NQHg1sZWwkTNeqWCJ/edit?usp=sharing&ouid=115321540829379572112&rtpof=true&sd=true) to get your institution's 4-digit 'izSuffix' for editing the izSuffix value above.

Implementers may want to consider hiding the current MMS ID field in Alma, under `View Configuration > Edit Full Display Details`.

## [Same Tab Menu Links](https://github.com/alliance-pcsg/ve-customizations/blob/main/same-tab-menu-links.js)
By default, menu links in the top nav bar to non-primo resources open in a new browser tab. This customization overrides that behavior, and opens these links in the same browser tab.

## [Custom Action Dialog](https://github.com/alliance-pcsg/ve-customizations/blob/main/custom-action-dialog)
A demonstration of a custom action that opens a form in a modal window for submission to a remote server, rather than opening a link.

## [Add Label to Advanced Search Chevron](https://github.com/alliance-pcsg/ve-customizations/blob/main/chevron-label)
This customization adds a label to the chevron button for advanced searches, controlled by a custom row in the Search Tile Labels code table.
