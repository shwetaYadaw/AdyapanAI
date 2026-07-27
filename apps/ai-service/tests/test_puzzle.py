import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.v1.puzzle import PuzzleRequest, PuzzleOption

client = TestClient(app)

# Mock API key for testing
TEST_API_KEY = "test_key"


@pytest.fixture
def mock_api_key(monkeypatch):
    """Mock the API key verification"""
    def mock_verify(*args, **kwargs):
        return TEST_API_KEY
    monkeypatch.setattr("app.core.security.verify_api_key", mock_verify)


@pytest.fixture
def sample_puzzle_request():
    """Create a sample puzzle request"""
    return PuzzleRequest(
        puzzleType="odd-one-out",
        question="Which shape is the odd one out?",
        options=[
            PuzzleOption(id="A", description="Triangle"),
            PuzzleOption(id="B", description="Square"),
            PuzzleOption(id="C", description="Circle"),
            PuzzleOption(id="D", description="Triangle"),
            PuzzleOption(id="E", description="Pentagon"),
        ],
        difficulty="easy",
    )


class TestPuzzleSolve:
    def test_solve_puzzle_success(self, mock_api_key, sample_puzzle_request):
        """Test successful puzzle solving"""
        response = client.post(
            "/api/v1/puzzle/solve",
            json=sample_puzzle_request.dict(),
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "correctAnswer" in data
        assert "confidence" in data
        assert "reasoning" in data
        assert "stepByStep" in data
        assert "explanation" in data
        assert 0 <= data["confidence"] <= 1

    def test_solve_puzzle_pattern(self, mock_api_key):
        """Test pattern puzzle solving"""
        request = PuzzleRequest(
            puzzleType="pattern",
            question="What is the next number in the sequence: 2, 4, 8, 16, ?",
            options=[
                PuzzleOption(id="A", description="24"),
                PuzzleOption(id="B", description="32"),
                PuzzleOption(id="C", description="48"),
            ],
            difficulty="medium",
        )
        response = client.post(
            "/api/v1/puzzle/solve",
            json=request.dict(),
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["correctAnswer"] == "B"

    def test_solve_puzzle_sequence(self, mock_api_key):
        """Test sequence puzzle solving"""
        request = PuzzleRequest(
            puzzleType="sequence",
            question="Find the next element: A, B, D, G, ?",
            options=[
                PuzzleOption(id="A", description="J"),
                PuzzleOption(id="B", description="K"),
                PuzzleOption(id="C", description="L"),
            ],
            difficulty="medium",
        )
        response = client.post(
            "/api/v1/puzzle/solve",
            json=request.dict(),
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code == 200

    def test_solve_puzzle_logic(self, mock_api_key):
        """Test logic puzzle solving"""
        request = PuzzleRequest(
            puzzleType="logic",
            question="If all birds have feathers, and a penguin is a bird, does a penguin have feathers?",
            options=[
                PuzzleOption(id="A", description="Yes"),
                PuzzleOption(id="B", description="No"),
                PuzzleOption(id="C", description="Cannot determine"),
            ],
            difficulty="easy",
        )
        response = client.post(
            "/api/v1/puzzle/solve",
            json=request.dict(),
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code == 200

    def test_solve_puzzle_missing_required_field(self, mock_api_key):
        """Test validation of required fields"""
        invalid_request = {
            "puzzleType": "pattern",
            # Missing 'question' field
            "options": [],
        }
        response = client.post(
            "/api/v1/puzzle/solve",
            json=invalid_request,
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code == 422  # Validation error

    def test_solve_puzzle_invalid_type(self, mock_api_key):
        """Test handling of invalid puzzle type"""
        request = PuzzleRequest(
            puzzleType="invalid_type",
            question="Test question",
            options=[PuzzleOption(id="A", description="Option")],
            difficulty="easy",
        )
        # Should still work but AI will handle the unknown type
        response = client.post(
            "/api/v1/puzzle/solve",
            json=request.dict(),
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code in [200, 400, 500]

    def test_solve_puzzle_empty_options(self, mock_api_key):
        """Test handling of empty options"""
        request = PuzzleRequest(
            puzzleType="pattern",
            question="Test question",
            options=[],
            difficulty="easy",
        )
        response = client.post(
            "/api/v1/puzzle/solve",
            json=request.dict(),
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code in [400, 500]


class TestPuzzleAnalyze:
    def test_analyze_puzzle_success(self, mock_api_key, sample_puzzle_request):
        """Test puzzle analysis"""
        response = client.post(
            "/api/v1/puzzle/analyze",
            json=sample_puzzle_request.dict(),
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "estimatedDifficulty" in data
        assert "conceptsTested" in data
        assert "learningOutcomes" in data
        assert "hints" in data
        assert "commonMistakes" in data

    def test_analyze_puzzle_difficulty_assessment(self, mock_api_key):
        """Test difficulty assessment"""
        request = PuzzleRequest(
            puzzleType="pattern",
            question="1 + 1 = ?",
            options=[
                PuzzleOption(id="A", description="1"),
                PuzzleOption(id="B", description="2"),
            ],
            difficulty="easy",
        )
        response = client.post(
            "/api/v1/puzzle/analyze",
            json=request.dict(),
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["estimatedDifficulty"].lower() == "easy"


class TestPuzzleBatch:
    def test_batch_solve_success(self, mock_api_key, sample_puzzle_request):
        """Test batch puzzle solving"""
        puzzles = [sample_puzzle_request.dict()] * 3
        response = client.post(
            "/api/v1/puzzle/batch",
            json=puzzles,
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert "totalSolved" in data
        assert len(data["results"]) == 3

    def test_batch_solve_limit(self, mock_api_key, sample_puzzle_request):
        """Test batch limit (max 10)"""
        puzzles = [sample_puzzle_request.dict()] * 15
        response = client.post(
            "/api/v1/puzzle/batch",
            json=puzzles,
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code == 400

    def test_batch_solve_partial_failure(self, mock_api_key):
        """Test batch with some invalid puzzles"""
        puzzles = [
            {
                "puzzleType": "pattern",
                "question": "Valid puzzle",
                "options": [PuzzleOption(id="A", description="A").dict()],
                "difficulty": "easy",
            },
            {
                "puzzleType": "pattern",
                # Missing question
                "options": [],
                "difficulty": "easy",
            },
        ]
        response = client.post(
            "/api/v1/puzzle/batch",
            json=puzzles,
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code in [200, 422]
        if response.status_code == 200:
            data = response.json()
            assert "results" in data
            # Should have mixed results


class TestPuzzleAuth:
    def test_solve_puzzle_without_auth(self, sample_puzzle_request):
        """Test that puzzle solving requires authentication"""
        response = client.post(
            "/api/v1/puzzle/solve",
            json=sample_puzzle_request.dict(),
        )
        assert response.status_code == 403  # Forbidden

    def test_analyze_puzzle_without_auth(self, sample_puzzle_request):
        """Test that puzzle analysis requires authentication"""
        response = client.post(
            "/api/v1/puzzle/analyze",
            json=sample_puzzle_request.dict(),
        )
        assert response.status_code == 403

    def test_batch_without_auth(self, sample_puzzle_request):
        """Test that batch requires authentication"""
        response = client.post(
            "/api/v1/puzzle/batch",
            json=[sample_puzzle_request.dict()],
        )
        assert response.status_code == 403


class TestPuzzleResponse:
    def test_response_format(self, mock_api_key, sample_puzzle_request):
        """Test response format compliance"""
        response = client.post(
            "/api/v1/puzzle/solve",
            json=sample_puzzle_request.dict(),
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code == 200
        data = response.json()

        # Validate structure
        assert isinstance(data["correctAnswer"], str)
        assert isinstance(data["confidence"], (int, float))
        assert isinstance(data["reasoning"], str)
        assert isinstance(data["stepByStep"], list)
        assert isinstance(data["explanation"], str)

        # Validate step-by-step is non-empty
        assert len(data["stepByStep"]) > 0
        for step in data["stepByStep"]:
            assert isinstance(step, str)

    def test_confidence_bounds(self, mock_api_key, sample_puzzle_request):
        """Test confidence is within bounds"""
        response = client.post(
            "/api/v1/puzzle/solve",
            json=sample_puzzle_request.dict(),
            headers={"Authorization": f"Bearer {TEST_API_KEY}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert 0 <= data["confidence"] <= 1
