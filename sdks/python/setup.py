from setuptools import setup, find_packages

setup(
    name="shrinkix",
    version="1.0.0",
    description="Official Python SDK for the Shrinkix Image Compression API",
    author="Shrinkix",
    author_email="support@shrinkix.com",
    packages=find_packages(),
    install_requires=[
        "requests>=2.25.0"
    ],
    python_requires=">=3.6",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)
