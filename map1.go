package main

import "fmt"

func main() {
	phonebook := map[string]string{"1234567890": "Alice", "9876543210": "Bob"}

	var choice int
	fmt.Println("1. Add  2. Search  3. Delete  4. Show All")
	fmt.Scan(&choice)

	var phone, name string

	switch choice {
	case 1:
		fmt.Print("Phone: ")
		fmt.Scan(&phone)
		fmt.Print("Name: ")
		fmt.Scan(&name)
		phonebook[phone] = name
		fmt.Println("Added!")

	case 2:
		fmt.Print("Phone: ")
		fmt.Scan(&phone)
		name, exists := phonebook[phone]
		if exists {
			fmt.Println("Found:", name)
		} else {
			fmt.Println("Not found")
		}

	case 3:
		fmt.Print("Phone: ")
		fmt.Scan(&phone)
		delete(phonebook, phone)
		fmt.Println("Deleted!")

	case 4:
		fmt.Println("Phonebook:")
		for number, name := range phonebook {
			fmt.Println("Number:", number, "Name:", name)
		}

	default:
		fmt.Println("Invalid choice")
	}
}
1