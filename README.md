# Laravel Nova ResponsiveTable

Laravel Nova ResponsiveTable is a Nova tool that enhances your Nova tables with the ability to hide and show columns in response to screen size changes. This makes your tables responsive and more user-friendly.

## Features

- **Responsive Tables**: Automatically hide and show columns in your Nova tables based on screen size changes.
- **Column Visibility Toggle**: Intuitive column visibility toggle for users.
- **No Dependencies**: Lightweight and doesn't rely on external libraries like jQuery DataTable.

## Installation

1. Install the package using Composer:

   ```bash
   composer require ostheneo/responsivetable
   ```

2. Register the tool in your NovaServiceProvider:

   ```php
   // In app/Providers/NovaServiceProvider.php

   // ...

   protected function tools()
   {
       return [
           // ...

           new \OsTheNeo\ResponsiveTable\ResponsiveTable,
       ];
   }

   // ...
   ```

3. Configure your Nova resources to use ResponsiveTable:

   In your Nova resource file, set the $tableStyle property to "responsive" to enable the responsive column visibility:

   ```php
   public static $tableStyle = "responsive";
   ```

That's it! Your Nova resource tables will now be responsive, and users can toggle column visibility based on screen size changes.

![Captura de pantalla de la funcionalidad de ResponsiveTable](https://raw.githubusercontent.com/OsTheNeo/ResponsiveTable/main/screenshot.png)

## License

Laravel Nova ResponsiveTable is open-source software licensed under the [MIT license](LICENSE.md).

## Support and Contribution

If you have any questions, issues, or feature requests, please [create an issue](https://github.com/ostheneo/responsivetable/issues) on the GitHub repository. Contributions are also welcome through pull requests.

## Credits

Laravel Nova ResponsiveTable is developed and maintained by [OsTheNeo](https://github.com/OsTheNeo).
