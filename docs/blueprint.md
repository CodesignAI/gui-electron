# **App Name**: CircuitSim Pro

## Core Features:

- OCN File Upload: Allows the user to upload an OCN file for circuit configuration.
- YAML Preconfiguration: Enables users to upload a YAML file to pre-fill configuration settings.
- Simulator Selection: Provides a dropdown menu to select the simulation engine (None, Cadence, Mathcad, Excel, PLECS).
- Design Variable Specification: Dynamically generates a list of design variables from the OCN file, pre-filled with min/max values from the YAML if available, allowing manual editing.
- Test Design Specification: Creates a list of test design variables from the OCN file, pre-filled from YAML (if available), with editable min/max values; clearly separates from design variables.
- Simulation Execution: Executes the simulation with the selected configurations, providing optional status updates, logs, and progress bars.
- Error Handling: Handles errors, providing clear messages and validation hints to guide the user through configuration.

## Style Guidelines:

- Primary color: #00B74A (Green) for CTAs and key actions, suggesting growth and positive outcomes. Use this to reinforce critical decision points and highlight interactive elements.
- Background color: #F0F0F0 (Very light gray), creating a neutral canvas to showcase detailed circuit information and support prolonged screen viewing. It provides a clean backdrop that enhances focus and minimizes distractions.
- Accent color: #007034 (Dark green) for hover states and subtle accents. This deeper tone adds a layer of sophistication and interactive feedback without overpowering the primary interface elements. Provides a familiar but slightly different hue to help with separation and interactivity.
- Font: 'IBM Plex Mono' (monospaced) for all text elements to ensure readability and maintain consistent alignment of configuration parameters. Note: currently only Google Fonts are supported.
- Implement a professional form layout with clear labels, input fields, and consistent spacing for enhanced usability.
- Use responsive design to adapt the layout to different screen sizes and devices, ensuring accessibility for all users.
- Subtle animations and transitions will provide feedback on interactions, such as loading states or confirmation messages, adding polish and a sense of responsiveness.