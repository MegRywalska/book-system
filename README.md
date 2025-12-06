# PaperTrail – Distributed Book Management System

Projekt zaliczeniowy z przedmiotu **Przetwarzanie rozproszone**.  
Aplikacja realizuje system zarządzania książkami, wypożyczeniami oraz logami użytkownika z wykorzystaniem architektury **mikroserwisowej** i **API Gateway**.

## O Projekcie

**PaperTrail** to system składający się z trzech mikroserwisów, bramy API oraz klienta webowego.  
Umożliwia:

- rejestrację i logowanie użytkowników  
- przeglądanie oraz zarządzanie książkami  
- tworzenie i zwroty wypożyczeń  
- rejestrowanie logów systemowych  
- obsługę dwóch ról: **USER** oraz **ADMIN**

Projekt implementuje wszystkie wymagania przedstawione w dokumentacji przedmiotu.

## Architektura

System składa się z pięciu niezależnych usług:

### 1. auth-service
- rejestracja użytkowników  
- logowanie i generowanie JWT  
- weryfikacja tokenów  
- osobna baza H2  

### 2. lending-books-app
- CRUD książek  
- zarządzanie ilością egzemplarzy  
- wypożyczanie i zwroty  
- rejestrowanie zdarzeń w log-service  
- osobna baza H2  

### 3. log-service
- zapis logów z pozostałych usług  
- filtrowanie, paginacja
- odczyt logów w panelu administratora  
- osobna baza H2  

### 4. gateway-service
- centralny punkt komunikacji  
- routing do mikroserwisów  
- konfiguracja CORS dla frontendu  

### 5. client (Frontend)
- aplikacja webowa React (Vite)  
- TailwindCSS + DaisyUI  
- React Router  
- autoryzacja JWT  
- panele użytkownika i administratora  

## 🛠 Technologie

### Backend:
- Java 17  
- Spring Boot 3  
- Spring Web  
- Spring Security (JWT)  
- Spring Data JPA  
- Spring Cloud Gateway  
- H2 Database  
- Validation API  
- Lombok

### Frontend:
- Vite  
- React  
- React Router  
- TailwindCSS  
- DaisyUI  
- Fetch API + JWT Auth  

## Funkcjonalności

### Autoryzacja
- rejestracja nowego użytkownika (imię, nazwisko, email, hasło)  
- logowanie + token JWT  
- role: USER / ADMIN  

### Książki (CRUD)
- dodawanie, edycja i usuwanie (ADMIN)  
- podgląd i lista książek (USER/ADMIN)

### Wypożyczenia
- tworzenie wypożyczeń (ADMIN)
- zwroty (ADMIN)
- widok wypożyczeń użytkownika (USER)
- widok wszystkich wypożyczeń (ADMIN)

### Logi systemowe
- zapis zdarzeń  
- filtrowanie i paginacja  
- podgląd logów (ADMIN)

## Uruchomienie projektu

W repozytorium przygotowano dwa skrypty ułatwiające start i zatrzymanie wszystkich usług systemu PaperTrail.

### Uruchamianie całego systemu

W katalogu głównym projektu wykonaj:
```
./start-services.ps1
```
Skrypt:
- uruchamia auth-service (8081)
- uruchamia lending-books-app (8080)
- uruchamia log-service (8082)
- uruchamia gateway-service (8083)
- uruchamia frontend Vite (5173)

Każdy serwis startuje w osobnym oknie PowerShell, umożliwiając podgląd logów na żywo.
Aplikacja dostępna pod: http://localhost:5173/

### Zatrzymywanie wszystkich usług

Aby zamknąć backend i frontend, użyj:

```
./stop-services.ps1
```

Skrypt automatycznie wyszukuje procesy działające na portach:
- 8080
- 8081
- 8082 
- 8083 
- 5173

### Konta testowe

| Rola | Email | Hasło |
|------|--------|--------|
| ADMIN | admin@books.local | admin123 |
| USER | dowolny z rejestracji | — |

## Struktura projektu
```
/auth-service
/lending-books-app
/log-service
/gateway-service
/client
/start-services.ps1
/stop-services.ps1
```

## Autor
**Małgorzata Rywalska**  
Student Kierunku Informatyki (specjalizacja: Programowanie)  
Projekt wykonany w ramach przedmiotu **Przetwarzanie rozproszone (2025)**


--- 

# PaperTrail – Distributed Book Management System

A course project developed for the subject **Distributed Processing**.  
The application implements a book, lending, and system logging platform using a **microservice architecture** and an **API Gateway**.

## About the Project

**PaperTrail** is a system composed of three microservices, an API gateway, and a web client.  
It provides:

- user registration and authentication  
- browsing and managing books  
- creating and returning lendings  
- system event logging  
- role-based access: **USER** and **ADMIN**

The project fulfills all requirements defined in the course documentation.

## Architecture

The system consists of five independent services:

### 1. auth-service
- user registration  
- login and JWT generation  
- token validation  
- dedicated H2 database  

### 2. lending-books-app
- full CRUD operations for books  
- management of available copies  
- creating and returning lendings  
- event logging to log-service  
- dedicated H2 database  

### 3. log-service
- storage of log events from other services  
- filtering and pagination  
- admin log viewer  
- dedicated H2 database  

### 4. gateway-service
- central entry point for all requests  
- routing to appropriate microservices  
- CORS configuration for the frontend  

### 5. client (Frontend)
- React (Vite) single-page application  
- TailwindCSS + DaisyUI  
- React Router  
- JWT authentication  
- dedicated dashboards for USER and ADMIN  

## Technologies

### Backend:
- Java 17  
- Spring Boot 3  
- Spring Web  
- Spring Security (JWT)  
- Spring Data JPA  
- Spring Cloud Gateway  
- H2 Database  
- Validation API  
- Lombok  

### Frontend:
- Vite  
- React  
- React Router  
- TailwindCSS  
- DaisyUI  
- Fetch API + JWT  

## Features

### Authentication
- user registration (first name, last name, email, password)  
- login and JWT generation  
- roles: USER and ADMIN  

### Books (CRUD)
- create, edit, and delete books (ADMIN)  
- view and list books (USER/ADMIN)

### Lendings
- create lendings (ADMIN)  
- return lendings (ADMIN)  
- view user lendings (USER)  
- view all lendings (ADMIN)

### System Logs
- storage of system events  
- filtering and pagination  
- admin log viewer  

## Running the Project

Two PowerShell scripts are included to simplify starting and stopping all services.

### Starting the entire system

From the project root directory:

```
./start-services.ps1
```

The script will:
- start auth-service (8081)  
- start lending-books-app (8080)  
- start log-service (8082)  
- start gateway-service (8083)  
- start the frontend Vite dev server (5173)

Each service opens in a separate PowerShell window, allowing live log inspection.

The web client is available at:  
http://localhost:5173/

### Stopping all services

To stop both backend and frontend:

```
./stop-services.ps1
```

The script automatically identifies and terminates any processes running on ports:
- 8080  
- 8081  
- 8082  
- 8083  
- 5173  

### Test Accounts

| Role  | Email               | Password |
|-------|----------------------|----------|
| ADMIN | admin@books.local    | admin123 |
| USER  | created via register | —        |

## Project Structure

```
/auth-service
/lending-books-app
/log-service
/gateway-service
/client
/start-services.ps1
/stop-services.ps1
```

## Author

**Małgorzata Rywalska**  
Computer Science student (Programming specialization).  
Project completed as part of the course **Distributed Processing (2025)**.
