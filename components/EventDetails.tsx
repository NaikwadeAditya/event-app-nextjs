import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "./BookEvent";
import EventCard from "./EventCards";
import {IEvent} from "@/database";
import {getSimilarEventsBySlug} from "@/lib/actions/event.actions";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>

    <ul>
      {agendaItems.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag, index) => (
      <div className="pill" key={`${tag}-${index}`}>
        {tag}
      </div>
    ))}
  </div>
);

const EventDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  // Get slug from URL
  const { slug } = await params;

  let event;

  try {
    const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
      next: {
        revalidate: 60,
      },
    });

    // API returned 404
    if (request.status === 404) {
      return notFound();
    }

    // Other API error
    if (!request.ok) {
      throw new Error(
        `Failed to fetch event: ${request.status} ${request.statusText}`
      );
    }

    const response = await request.json();

    console.log("Event API Response:", response);

    event = response.event;
  } catch (error) {
    console.error("Error fetching event:", error);

    // Don't call notFound() here because notFound()
    // itself throws a Next.js internal 404 error.
    throw error;
  }

  // API succeeded but event doesn't exist
  if (!event) {
    return notFound();
  }

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = event;

  // Required data check
  if (!description) {
    return notFound();
  }

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">

      {/* Header */}
      <div className="header">
        <h1>Event Description</h1>

        <p>{description}</p>
      </div>

      {/* Event Details */}
      <div className="details">

        {/* Left Side - Event Content */}
        <div className="content">

          {/* Event Image */}
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />

          {/* Overview */}
          <section className="flex-col-gap-2">
            <h2>Overview</h2>

            <p>{overview}</p>
          </section>

          {/* Event Details */}
          <section className="flex-col-gap-2">

            <h2>Event Details</h2>

            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />

            <EventDetailItem
              icon="/icons/clock.svg"
              alt="clock"
              label={time}
            />

            <EventDetailItem
              icon="/icons/pin.svg"
              alt="pin"
              label={location}
            />

            <EventDetailItem
              icon="/icons/mode.svg"
              alt="mode"
              label={mode}
            />

            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />

          </section>

          {/* Agenda */}
          <EventAgenda agendaItems={agenda} />

          {/* Organizer */}
          <section className="flex-col-gap-2">

            <h2>About the Organizer</h2>

            <p>{organizer}</p>

          </section>

          {/* Tags */}
          <EventTags tags={tags} />

        </div>

        {/* Right Side - Booking */}
        <aside className="booking">

          <div className="signup-card">

            <h2>Book Your Spot</h2>

            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">
                Be the first to book your spot!
              </p>
            )}

            {/* Booking component can be added later */}
            
            <BookEvent
              eventId={event._id}
              slug={event.slug}
            />
           

          </div>

        </aside>

      </div>

      {/* Similar Events */}
      <div className="flex w-full flex-col gap-4 pt-20">

        <h2>Similar Events</h2>

        
        <div className="events">

          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: IEvent) => (
              <EventCard
                key={similarEvent.title}
                {...similarEvent}
              />
            ))}

        </div>
       

      </div>

    </section>
  );
};

export default EventDetails;