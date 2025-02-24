import csv
import os
from django.core.management.base import BaseCommand
from main.models import Essays  # Import your model

class Command(BaseCommand):
    help = 'Import essay data from a CSV file'

    #def add_arguments(self, parser):
    #    parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file_path = r"./essaycompdata.csv"  # Path to your CSV file

        if not os.path.exists(csv_file_path):
            self.stderr.write(self.style.ERROR(f'File "{csv_file_path}" not found.'))
            return

        with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                name = row['Name']
                student_class = row['Class']
                section = row['Section']
                if row['Category'].strip().lower() == 'senior':
                    category = True
                else:
                    category = False
                #category = row['Category'].strip().lower() in ['true', '1', 'yes']  # Convert to boolean
                link = row['Link']

                # Create and save the object
                essay, created = Essays.objects.get_or_create(
                    student_name=name,
                    grade=student_class,
                    section=section,
                    category=category,
                    essay_link=link
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f'Successfully added {name}'))
                else:
                    self.stdout.write(self.style.WARNING(f'{name} already exists, skipping.'))

        self.stdout.write(self.style.SUCCESS('Data import completed!'))
