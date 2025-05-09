# Intercollege Club Management System

## Project Overview
This system is designed to manage clubs efficiently across multiple colleges. It provides various controllers to perform CRUD operations and allows users to engage with clubs through ratings and memberships.

## Models
### Club
- **name**: Name of the club.
- **id**: Unique identifier.
- **members**: List of club members.
- **admin**: Club administrators.
- **type**: Type/category of the club.
- **college_name**: College associated with the club.
- **rating**: Average rating of the club.
- **logo**: Club emblem or logo.
- **description**: Overview of the club’s mission and activities.
- **creation_date**: Date the club was established.
- **social_media_links**: URLs to the club’s online presence.

### Student
- **id**: Unique identifier.
- **name**: Name of the student.
- **type**: Role (admin/member).
- **college_name**: College of the student.
- **email**: Contact email.

### Event
- **id**: Unique identifier.
- **event**: Event name/description.
- **rating**: Event rating.

## Controllers
- **Add Club**: Create a new club.
- **Add Admin**: Assign an admin to a club.
- **Remove Admin**: Remove an admin from a club.
- **Add Member**: Add a student as a club member.
- **Remove Member**: Remove a student from a club.
- **Post Event**: Create a new event.
- **Delete Event**: Remove an event.
- **Update Event**: Modify event details.
- **Update Club**: Modify club details.
- **Delete Club**: Remove a club from the system.
- **Rate/Review Event**: Provide feedback on events.
- **Register Request for Club**: Request to join a club.
- **Search Club**: Find clubs based on categories, college, or interests.

## Setup Instructions
1. Clone the repository.
2. Install necessary dependencies.
3. Run the server and start using the system.

---