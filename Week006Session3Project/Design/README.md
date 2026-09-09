# Wrong Flight Adventure

This README includes a sequence diagram that matches the exact story nodes in `traveller-script.js`.

```mermaid
sequenceDiagram
    autonumber
    actor Player
    participant Start as start
    participant CheckBoardPass as check-board-pass
    participant AskSeatmate as ask-seatmate
    participant TellAttendant as tell-attendant
    participant UsePhone as use-phone
    participant WaitAndThink as wait-and-think
    participant DeplaneNow as deplane-now
    participant RerouteFromFlightDestination as reroute-from-flight-destination
    participant AcceptFlightDestination as accept-flight-destination
    participant EndingCaught as ending-caught-in-time
    participant EndingRebooked as ending-rebooked
    participant EndingDetour as ending-flight-destination-detour

    Player->>Start: Begin the game

    alt Check the boarding pass and booking email
        Start->>CheckBoardPass: nextId
        alt Ask the flight attendant to confirm the destination
            CheckBoardPass->>TellAttendant: nextId
            alt Ask to deplane immediately and return to the right gate
                TellAttendant->>DeplaneNow: nextId
                DeplaneNow->>EndingCaught: nextId
            else Ask whether there is any same-day route back to the intended destination
                TellAttendant->>RerouteFromFlightDestination: nextId
                alt Keep the trip and build a new plan from the route you are already on
                    RerouteFromFlightDestination->>EndingRebooked: nextId
                else Get off now and try to recover the original itinerary
                    RerouteFromFlightDestination->>DeplaneNow: nextId
                    DeplaneNow->>EndingCaught: nextId
                end
            else If the plane is already boarding, stay on and solve it later
                TellAttendant->>AcceptFlightDestination: nextId
                alt Rebook a return connection as soon as you land
                    AcceptFlightDestination->>EndingRebooked: nextId
                else Treat the detour as an unplanned trip and continue on
                    AcceptFlightDestination->>EndingDetour: nextId
                end
            end
        else Use your phone to see whether you can still change flights
            CheckBoardPass->>UsePhone: nextId
            alt Message the airline and ask for the fastest correction
                UsePhone->>RerouteFromFlightDestination: nextId
                RerouteFromFlightDestination->>EndingRebooked: nextId
            else Compare your pass with nearby passengers and confirm the mistake
                UsePhone->>AskSeatmate: nextId
                AskSeatmate->>TellAttendant: nextId
            else Go straight to the attendant and admit the mix-up
                UsePhone->>DeplaneNow: nextId
                DeplaneNow->>EndingCaught: nextId
            end
        else Stay calm and wait for the safest moment to speak up
            CheckBoardPass->>WaitAndThink: nextId
            alt Get off before the doors close
                WaitAndThink->>DeplaneNow: nextId
                DeplaneNow->>EndingCaught: nextId
            else Ask the crew about a same-day reroute
                WaitAndThink->>RerouteFromFlightDestination: nextId
                RerouteFromFlightDestination->>EndingRebooked: nextId
            else Stay on board and accept the mistake
                WaitAndThink->>AcceptFlightDestination: nextId
                alt Rebook a return connection as soon as you land
                    AcceptFlightDestination->>EndingRebooked: nextId
                else Treat the detour as an unplanned trip and continue on
                    AcceptFlightDestination->>EndingDetour: nextId
                end
            end
        end

    else Ask the passenger beside you where this flight is going
        Start->>AskSeatmate: nextId
        alt Tell a flight attendant right away
            AskSeatmate->>TellAttendant: nextId
            TellAttendant->>DeplaneNow: nextId
            DeplaneNow->>EndingCaught: nextId
        else Check your phone and see if the airline app can help
            AskSeatmate->>UsePhone: nextId
            UsePhone->>RerouteFromFlightDestination: nextId
            RerouteFromFlightDestination->>EndingRebooked: nextId
        else Accept the mistake and figure out the next step after landing
            AskSeatmate->>AcceptFlightDestination: nextId
            alt Rebook a return connection as soon as you land
                AcceptFlightDestination->>EndingRebooked: nextId
            else Treat the detour as an unplanned trip and continue on
                AcceptFlightDestination->>EndingDetour: nextId
            end
        end

    else Alert a flight attendant before the doors close
        Start->>TellAttendant: nextId
        alt Ask to deplane immediately and return to the right gate
            TellAttendant->>DeplaneNow: nextId
            DeplaneNow->>EndingCaught: nextId
        else Ask whether there is any same-day route back to the intended destination
            TellAttendant->>RerouteFromFlightDestination: nextId
            RerouteFromFlightDestination->>EndingRebooked: nextId
        else If the plane is already boarding, stay on and solve it later
            TellAttendant->>AcceptFlightDestination: nextId
            AcceptFlightDestination->>EndingDetour: nextId
        end
    end
```

The diagram mirrors the live story structure in [traveller-script.js](traveller-script.js). The story stays generic: the traveller has boarded the wrong flight and must choose how to still reach the intended destination.
