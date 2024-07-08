# your_app/management/commands/populate_wordlist.py

from django.core.management.base import BaseCommand
from datetime import date
from main.models import WordList

class Command(BaseCommand):
    help = 'Populate WordList database with dates and words'

    def handle(self, *args, **kwargs):
        # Define the dates and corresponding words
        data = [
            {'date': date(2024, 7, 7), 'word': 'Pilot'},
            {'date': date(2024, 7, 8), 'word': 'Radar'},
            {'date': date(2024, 7, 9), 'word': 'Ceres'},
            {'date': date(2024, 7, 10), 'word': 'Earth'},
            {'date': date(2024, 7, 11), 'word': 'Orion'},
            {'date': date(2024, 7, 12), 'word': 'Libra'},
            {'date': date(2024, 7, 13), 'word': 'Titan'},
            {'date': date(2024, 7, 14), 'word': 'Lunar'},
            {'date': date(2024, 7, 15), 'word': 'Rotor'},
            {'date': date(2024, 7, 16), 'word': 'Orbit'},
            {'date': date(2024, 7, 17), 'word': 'Cargo'},
            {'date': date(2024, 7, 18), 'word': 'Drone'},
            {'date': date(2024, 7, 19), 'word': 'Aries'},
            {'date': date(2024, 7, 20), 'word': 'Glare'},
            {'date': date(2024, 7, 21), 'word': 'Pluto'},
            {'date': date(2024, 7, 22), 'word': 'Flaps'},
            {'date': date(2024, 7, 23), 'word': 'Globe'},
            {'date': date(2024, 7, 24), 'word': 'Windy'},
            {'date': date(2024, 7, 25), 'word': 'Scout'},
            {'date': date(2024, 7, 26), 'word': 'Solar'},
            {'date': date(2024, 7, 27), 'word': 'Astro'},
            {'date': date(2024, 7, 28), 'word': 'Comet'},
            {'date': date(2024, 7, 29), 'word': 'Atlas'},
            {'date': date(2024, 7, 30), 'word': 'Virgo'},
            {'date': date(2024, 7, 31), 'word': 'Space'},
            {'date': date(2024, 8, 1), 'word': 'hover'},
            {'date': date(2024, 8, 2), 'word': 'board'},
            {'date': date(2024, 8, 3), 'word': 'Cabin'},
            {'date': date(2024, 8, 4), 'word': 'Glide'},
            {'date': date(2024, 8, 5), 'word': 'Pitch'},
            {'date': date(2024, 8, 6), 'word': 'Radio'},
            {'date': date(2024, 8, 7), 'word': 'flare'},
            {'date': date(2024, 8, 8), 'word': 'probe'},
            {'date': date(2024, 8, 9), 'word': 'Dwarf'},
            {'date': date(2024, 8, 10), 'word': 'Light'},
            {'date': date(2024, 8, 11), 'word': 'Fleet'},
            {'date': date(2024, 8, 12), 'word': 'Wings'},
            {'date': date(2024, 8, 13), 'word': 'Polar'},
        ]

        # Bulk create WordList objects
        WordList.objects.bulk_create(
            WordList(date=item['date'], word=item['word']) for item in data
        )

        self.stdout.write(self.style.SUCCESS('Successfully populated WordList database'))
