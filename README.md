# Fuzzy Buddies by Axolotl-Logic

Warning, under heavy development.

Let raccoons rattle your app with independent campaigns of mischief designed to help find where your app is defficient and keep it fixed. Did they find a particularly interesting path through your app? Rerun the journey or instantly generate an e2e test case to add to your application.

## How It Works

### The Buddies

The system features a series of testing agents designed to simulate different interaction patterns with your app. They opperate exclusively by reading the accessibility tree of the page, clicking on elements, and typing. This is both a limitation and a super power that allows automated tests to be generated and sessions to be reliably replayed.

- **Clicky** 🦝👆 - Clicks on random widgets.

- **Phillip** 🦝✏️ - Fills out forms and then clicks a button hoping to submit.

### Testing Process

1. **Campaign Creation**: Users launch testing campaigns by providing a target URL
2. **Automated Exploration**: The selected buddy navigates through the application for a specified depth
3. **Accessibility Analysis**: Each interaction is analyzed using axe-core for WCAG compliance
4. **Finding Documentation**: Issues are automatically categorized and stored with detailed information

### Technical Architecture

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and Radix UI components
- **Backend**: Server actions with Drizzle ORM and PostgreSQL
- **Testing Engine**: Puppeteer for browser automation with axe-core for accessibility analysis
- **Database**: PostgreSQL with tables for campaigns, actions, findings, buddies, and hints

## Key Features

- **Automated Accessibility Testing**: Continuous monitoring using industry-standard axe-core
- **Interactive Dashboard**: View campaigns, findings, and detailed reports
- **Buddy Profiles**: Learn about each testing agent's capabilities and focus areas
- **Finding Management**: Categorized accessibility issues with remediation guidance
- **Campaign Tracking**: Monitor testing progress and results over time

## Database Schema

The application tracks:

- **Campaigns**: Testing sessions with start URLs and execution details
- **Actions**: Individual interactions performed by buddies
- **Findings**: Accessibility issues discovered during testing
- **Buddies**: Testing agent profiles and capabilities
- **Hints**: Guidance and tips for accessibility improvements

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (copy `.env.example` to `.env.local`)

4. Start the database:

   ```bash
   ./start-database.sh
   ```

5. Run database migrations:

   ```bash
   npm db:migrate
   ```

6. Start the development server:
   ```bash
   npm dev
   ```

### Usage

1. Navigate to the application homepage
2. Enter a target URL in the campaign form
3. Launch the campaign and monitor progress
4. Review findings and accessibility reports
5. Click "Explore" to go deeper into your app

## Development

```
src/
├── app/            # Next.js app router pages and components
├── agent/          # Buddy implementations and testing logic
├── components/     # Reusable UI components
├── lib/            # Utility functions
└── server/         # Server actions and database operations
```

## Contributing

Adding buddies easy! Copy clicky or phillip, edit to your heart's content, then add them to setupBuddies.

## Warning

⚠️ **Important**: Only point the fuzzy buddies at websites you own or have permission to test. The buddies can be aggressive in their testing and may trigger unexpected behaviors on target sites.
