/*
  Program: Dining Meal Booking Console App
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 20 July 2026
*/

import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { MealBooking } from './MealBooking.js';

console.log("--- Welcome to DWU Dining Services ---\n");

// Array to store created MealBooking objects
const bookings = [];